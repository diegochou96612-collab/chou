# -*- coding: utf-8 -*-
import pypdfium2 as pdfium
from PIL import Image
import os, zipfile, re

# ── Paths ────────────────────────────────────────────────────
PDF_PATH   = r'C:\Users\chchou\Downloads\第六屆台灣尤努斯創新獎商業計畫書 (2).pdf'
UNPACK_DIR = r'D:\周子謙\claude_code工作資料夾\unpacked_v1'
OUT_PATH   = r'D:\周子謙\claude_code工作資料夾\output_v1.docx'
MEDIA_DIR  = os.path.join(UNPACK_DIR, 'word', 'media')
os.makedirs(MEDIA_DIR, exist_ok=True)

# ══════════════════════════════════════════════════════════════
# STEP 1: Extract images from PDF pages 12 & 13 (0-indexed 11,12)
# ══════════════════════════════════════════════════════════════
pdf = pdfium.PdfDocument(PDF_PATH)
extracted = []  # {rId, fname, cx, cy}
rid_start = 5   # existing rels use rId1-rId4 typically
img_count = 0

for page_idx in [11, 12]:
    page = pdf[page_idx]
    for obj in page.get_objects():
        if type(obj).__name__ == 'PdfImage':
            try:
                bmp = obj.get_bitmap()
                pil = bmp.to_pil()
                img_count += 1
                fname = f'image{img_count}.png'
                fpath = os.path.join(MEDIA_DIR, fname)
                pil.save(fpath)
                w, h = pil.size
                # Target width ~5,000,000 EMU (about 5.47 inches), keep ratio
                # Scale to fit max 4,500,000 EMU wide × 3,000,000 EMU tall (~4.9" × 3.3")
                max_w, max_h = 4500000, 3000000
                scale = min(max_w / w, max_h / h)
                cx = int(w * scale)
                cy = int(h * scale)
                rid = f'rId{rid_start + img_count - 1}'
                extracted.append({'rid': rid, 'fname': fname, 'cx': cx, 'cy': cy, 'id': img_count})
                print(f'  Extracted {fname}: {w}x{h} → cx={cx} cy={cy}')
            except Exception as e:
                print(f'  Skip obj: {e}')

print(f'Total images extracted: {len(extracted)}')

# ══════════════════════════════════════════════════════════════
# STEP 2: Update _rels/document.xml.rels
# ══════════════════════════════════════════════════════════════
rels_path = os.path.join(UNPACK_DIR, 'word', '_rels', 'document.xml.rels')
with open(rels_path, 'r', encoding='utf-8') as f:
    rels_xml = f.read()

IMG_REL_TYPE = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image'
for img in extracted:
    new_rel = f'<Relationship Id="{img["rid"]}" Type="{IMG_REL_TYPE}" Target="media/{img["fname"]}"/>'
    if img['rid'] not in rels_xml:
        rels_xml = rels_xml.replace('</Relationships>', f'  {new_rel}\n</Relationships>')

with open(rels_path, 'w', encoding='utf-8') as f:
    f.write(rels_xml)
print('Updated _rels/document.xml.rels')

# ══════════════════════════════════════════════════════════════
# STEP 3: Update [Content_Types].xml
# ══════════════════════════════════════════════════════════════
ct_path = os.path.join(UNPACK_DIR, '[Content_Types].xml')
with open(ct_path, 'r', encoding='utf-8') as f:
    ct_xml = f.read()

if 'Extension="png"' not in ct_xml:
    ct_xml = ct_xml.replace('</Types>', '  <Default Extension="png" ContentType="image/png"/>\n</Types>')
    with open(ct_path, 'w', encoding='utf-8') as f:
        f.write(ct_xml)
    print('Updated [Content_Types].xml')

# ══════════════════════════════════════════════════════════════
# STEP 4: Rebuild document.xml
# ══════════════════════════════════════════════════════════════
with open(os.path.join(UNPACK_DIR, 'word', 'document.xml'), 'r', encoding='utf-8') as f:
    old_xml = f.read()

# Extract cover page: everything from <w:body> up to (not including) my first page break
PB_MARKER = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
body_start = old_xml.index('<w:body>') + len('<w:body>')
pb_pos = old_xml.index(PB_MARKER)
cover_xml = old_xml[body_start:pb_pos]  # cover page paragraphs only

# ── XML helpers ──────────────────────────────────────────────
def esc(t):
    return t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def para(text, bold=False, indent=False, center=False, sa=60, sb=0, color='1F1F1F'):
    jc    = '<w:jc w:val="center"/>' if center else ''
    b     = '<w:b/>' if bold else ''
    pPr   = f'<w:pPr><w:pStyle w:val="Default"/>{jc}<w:spacing w:before="{sb}" w:after="{sa}"/><w:rPr>{b}<w:color w:val="{color}"/></w:rPr></w:pPr>'
    rPr   = f'<w:rPr>{b}<w:rFonts w:hint="eastAsia"/><w:color w:val="{color}"/></w:rPr>'
    prefix = esc('　　') if indent else ''
    return f'<w:p>{pPr}<w:r>{rPr}<w:t xml:space="preserve">{prefix}{esc(text)}</w:t></w:r></w:p>\n'

# Spacing: heading sb=240 sa=120 | body sb=0 sa=60
# → body→heading: max(60,240)=240 (大) | heading→body: max(120,0)=120 (中) | body→body: max(60,0)=60 (小)
def h1(t): return para(t, bold=True, sa=120, sb=240)
def h2(t): return para(t, bold=True, sa=120, sb=240)
def h3(t): return para(t,            sa=120, sb=240)
def body(t): return para(t, indent=True, sa=60)
def sp(): return '<w:p><w:pPr><w:spacing w:after="80"/></w:pPr></w:p>\n'
def pb(): return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>\n'

def img_xml(img):
    """Generate inline image XML."""
    ns_a   = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
    ns_pic = 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
    ns_r   = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
    return f'''<w:p>
  <w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="80"/></w:pPr>
  <w:r><w:rPr/><w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0"
      xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
      <wp:extent cx="{img['cx']}" cy="{img['cy']}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="{img['id']}" name="Image{img['id']}" descr="產品圖片"/>
      <wp:cNvGraphicFramePr>
        <a:graphicFrameLocks {ns_a} noChangeAspect="1"/>
      </wp:cNvGraphicFramePr>
      <a:graphic {ns_a}>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:pic {ns_pic}>
            <pic:nvPicPr>
              <pic:cNvPr id="{img['id']}" name="Image{img['id']}"/>
              <pic:cNvPicPr/>
            </pic:nvPicPr>
            <pic:blipFill>
              <a:blip {ns_r} r:embed="{img['rid']}"/>
              <a:stretch><a:fillRect/></a:stretch>
            </pic:blipFill>
            <pic:spPr>
              <a:xfrm><a:off x="0" y="0"/><a:ext cx="{img['cx']}" cy="{img['cy']}"/></a:xfrm>
              <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
            </pic:spPr>
          </pic:pic>
        </a:graphicData>
      </a:graphic>
    </wp:inline>
  </w:drawing></w:r>
</w:p>\n'''

# ── Table helper (for 參) ─────────────────────────────────────
CW   = 8306
TC_L = 2200
TC_R = CW - TC_L

def bmc_row(label, lines, header=False):
    fill_l = '1F3864' if header else 'D6E4F0'
    fill_r = '1F3864' if header else 'FFFFFF'
    lcolor = 'FFFFFF' if header else '1F1F1F'
    b = '<w:b/>'
    marg = '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>'
    lc = f'<w:tc><w:tcPr><w:tcW w:w="{TC_L}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="{fill_l}"/>{marg}<w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr>{b}<w:rFonts w:hint="eastAsia"/><w:color w:val="{lcolor}"/></w:rPr><w:t>{esc(label)}</w:t></w:r></w:p></w:tc>'
    paras = ''
    for i, line in enumerate(lines):
        sa2 = '60' if i < len(lines)-1 else '0'
        rcolor = 'FFFFFF' if header else '1F1F1F'
        rb = f'<w:b/>' if header else ''
        paras += f'<w:p><w:pPr><w:spacing w:after="{sa2}"/><w:jc w:val="{"center" if header else "left"}"/></w:pPr><w:r><w:rPr>{rb}<w:rFonts w:hint="eastAsia"/><w:color w:val="{rcolor}"/></w:rPr><w:t>{esc(line)}</w:t></w:r></w:p>'
    rc = f'<w:tc><w:tcPr><w:tcW w:w="{TC_R}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="{fill_r}"/>{marg}</w:tcPr>{paras}</w:tc>'
    return f'<w:tr>{lc}{rc}</w:tr>\n'

def bmc_table():
    brd = '<w:val>single" w:sz="4" w:color="999999"/>'
    borders = '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="999999"/><w:left w:val="single" w:sz="4" w:color="999999"/><w:bottom w:val="single" w:sz="4" w:color="999999"/><w:right w:val="single" w:sz="4" w:color="999999"/><w:insideH w:val="single" w:sz="4" w:color="999999"/><w:insideV w:val="single" w:sz="4" w:color="999999"/></w:tblBorders>'
    rows  = bmc_row('要素', ['內容說明'], header=True)
    data  = [
        ('關鍵合作夥伴', ['高齡日間照顧中心、長青學苑、社區發展協會、樂齡教具經銷商、政府長照單位，以及職能治療師協會']),
        ('關鍵活動',   ['持續研發與優化教具及天秤機構；舉辦社區據點推廣體驗會；辦理高齡桌遊指導員培訓課程']),
        ('價值主張',   ['提供市面少見的「雙效合一」樂齡教具。單一遊戲即可同步鍛鍊「短期記憶力」與「手部精細肌肉」，',
                        '有效訓練長者本體感覺並大幅降低遊玩挫折感']),
        ('顧客關係',   ['定期回訪機構收集回饋，建立線上樂齡社群，提供後續教案更新與玩法擴充支援']),
        ('目標客群',   ['初期鎖定新北市新店區 55 至 75 歲初老族群，專為兩人設計，主打居家共遊情境']),
        ('關鍵資源',   ['特色天秤機構與聲音反饋專利、高齡心理與職能治療顧問團隊、完善的社區推廣網絡']),
        ('通路',       ['【實體】與安養中心、長青社團合作，定位為常態性活動輔具；同時參展長照輔具展覽',
                        '【線上】佈局樂齡網等電商平台']),
        ('成本結構',   ['教具生產材料費（木料、專利組件）、研發與講師人事費、行銷推廣與據點交通開銷']),
        ('收益流',     ['桌遊教具終端銷售收入、B2B 機構長期租賃方案、桌遊帶領員認證培訓學費']),
    ]
    for label, lines in data:
        rows += bmc_row(label, lines)
    return f'<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="{CW}" w:type="dxa"/>{borders}<w:tblLook w:val="0000"/></w:tblPr><w:tblGrid><w:gridCol w:w="{TC_L}"/><w:gridCol w:w="{TC_R}"/></w:tblGrid>{rows}</w:tbl>\n'

# ── Build new body content ─────────────────────────────────────
c = pb()  # page break after cover

# 壹
c += h1('壹、欲解決的社會問題')
c += h2('一、高齡化帶來的認知退化危機與現有困境')
c += body('台灣正加速邁入超高齡社會，長者的認知與生理機能退化，已成為無可迴避的社會挑戰。根據衛福部最新的全國社區失智症流行病學調查，全台失智人口已正式突破 38 萬人（衛生福利部 2024），未來幾年內更預估將逼近 50 萬人大關（國家發展委員會 2018）。')
c += body('然而，當前傳統單一的身體活動或單一認知訓練效果有限，無法模擬日常生活的多工需求。在藥物治療無法完全解決問題的情況下，非藥物介入的需求極為迫切；且目前社區場域（如日照中心）普遍缺乏標準化且有實證支持的介入模式，顯示市場對於創新延緩高齡認知退化方案的需求極為迫切。')
c += h2('二、田野訪談與真實痛點發掘')
c += body('為了確實掌握潛在用戶的真實需求，團隊於開發初期針對 50 至 70 歲的初老與銀髮族群發放了 Google 網路問卷進行市場調查。起初，我們的構想是開發一款協助長輩日常生活的數位 LINE Bot，但在大量彙整這群真實長輩的反饋後，我們察覺到了市場真正的缺口。')
c += body('問卷與後續的訪談結果顯示，目前市面的高齡健康促進輔具多半功能單一。長輩們反映，純認知型的益智遊戲或數位介面，常因缺乏肢體動作的實體回饋，容易讓長輩感到乏味而產生抗拒。此外，許多長輩常因手部顫抖等生理限制，在參與現有遊戲過程中頻頻受挫，最終甚至排斥參與任何社群互動。')
c += body('這些第一手調查反饋，促使團隊放棄原先的 LINE Bot，轉而打造能兼顧「實體肢體回饋」與「防挫折機制」的健康促進桌遊，真正解決長者在社交與生理退化上遇到的痛點。')
c += h2('三、團隊解方與計畫可實現性')
c += body('針對上述痛點，本計畫量身打造了一款專屬高齡者的互動桌遊。在技術可行性上，團隊已自行掌握核心的「觸覺天秤機構」與「聲音反饋裝置」等開發技術。同時，為確保產品符合臨床醫學原理，亦邀請高齡心理與職能治療專家擔任顧問進行監修。')
c += body('透過遊戲中高頻率、低門檻的正向回饋機制，期望能在沒有壓力的情境下，有效延緩長輩的認知退化，並大幅降低因生理衰退所產生的挫折感與孤立感。')

# 貳
c += h1('貳、公司目標、願景與產品內容')
c += h2('一、產品與服務內容')
c += body('本產品是一款特別為長者打造的多功能桌遊教具，主要包含以下三個核心遊戲機制：')
c += h3('（一）大富翁式棋盤與記憶挑戰')
c += body('遊戲地圖設計為 12 格的正方形。其中 8 格會放置生活常見物品的記憶卡片，長者需記住圖案後將卡片蓋上。另外包含 3 格「機會與命運」，以及 1 格起點。（完整卡牌清單請見附件）')
c += h3('（二）雙硬幣隨機遊戲機制')
c += body('捨棄傳統骰子，改用拋擲兩枚硬幣來決定玩家行動。若擲出兩面人頭，玩家前進兩格；若擲出兩面數字，玩家留在原地但可翻看一張牌；若擲出一頭一數字，玩家前進一格並需進行「抽積木」挑戰。積木塔倒塌則遊戲結束；若未倒，玩家可再前進一格，但必須正確說出下一格覆蓋的卡牌內容。')
c += h3('（三）防挫折的創新觸覺天秤機制')
c += body('考量到部分長者可能因手部顫抖而感到挫折，設計了「感官天秤挑戰」作為替代方案。天秤桿子上設有多個孔洞，長者需把沒有標示重量的砝碼掛上去，依靠觸覺感受重量。若掛放不當導致天秤過度歪斜，裝置會發出輕脆的「咖」機械聲，代表挑戰失敗。')
c += h3('（四）產品原型操作與演示影片')
c += body('影片連結：https://youtu.be/RjYGkB2AUt8（待填入。）影片實際示範了桌遊中的雙硬幣機制，以及長者如何進行記憶卡牌的覆蓋與無標示砝碼的天秤挑戰，並收錄了天秤失去平衡時所發出的溫和機械音「喀」聲回饋。')
c += h2('二、公司目標與願景')
c += h3('（一）營運目標')
c += body('建立並優化標準化的教具生產流程。預計在第一年內完成產品最終改良與量產，並推廣至全台灣至少 50 個社區照顧關懷據點與日照中心。')
c += h3('（二）社會使命')
c += body('以社會企業模式經營。所有利潤都將重新投入研發，致力開發更適合高齡者的無障礙遊戲輔具，回饋給更多受高齡化影響的社區。')
c += h3('（三）長期願景')
c += body('目標在五年內，把這套產品推廣到全台各鄉鎮的樂齡學習中心。由於桌上遊戲適合多人參與、規則彈性且能創造持續社交互動，期望讓更多地區的長者享有充滿趣味的認知訓練資源，打造跨世代共遊、沒有年齡隔閡的健康老化環境。')

# 參（表格）
c += h1('參、商業模式')
c += body('本計畫採行「B2B 機構推廣為主、B2C 終端銷售為輔」的雙軌營運策略。透過機構的常態性應用建立產品口碑，並以「直接採購與長期租賃」並行的彈性方案，為團隊挹注穩定且具延續性的現金流。')
c += sp()
c += bmc_table()
c += sp()

# 肆
c += h1('肆、計畫創新性與獨特性')
c += body('經深度盤點與分析現行高齡照護市場之競品，本團隊萃取過往同類產品之成敗經驗，並嚴格揉合醫學實證與學術研究數據，轉化為本計畫之三大核心競爭優勢：')
c += h2('一、打破單一訓練侷限，手腦結合的雙重刺激任務訓練')
c += body('多數銀髮桌遊於市場鎩羽而歸之主因，乃在於僅將常規桌遊進行視覺放大，或限縮於純認知型益智解謎，致使正向回饋匱乏。本計畫導入「雙重任務訓練」的實證概念，將注意力（雙硬幣驅動）、記憶力（卡牌位置記憶）、語言能力（口語表達卡牌內容）以及建構定義能力完美結合，促使高齡者同步執行認知性與動作性任務。國內臨床研究證實，經八週訓練後長者在 MMSE 記憶力分數呈現顯著成長，MoCA 延遲記憶分數亦達顯著進步，上下肢肌力皆有提升（李佳穎，2026）。本產品深度整合手部精細肌肉之微控機制，藉此達成全面性大腦與末梢神經活化。')
c += h2('二、構築高頻率之正向心理回饋機制')
c += body('國內外多項學術研究均證實（劉婕妤，2019），桌上遊戲具備顯著提升機構高齡者正向情緒與緩解憂鬱之療效。本計畫刻意屏除易引發長者強烈挫折感之懲罰機制，轉而導入短時效且高頻次之正向回饋系統。當天秤挑戰失衡時，裝置僅釋放溫和之機械「喀」聲作為警示，確保長者得以於極短時間內獲取成就感，大幅優化其反覆遊玩之黏著度與遵從性。')
c += h2('三、營造自然且無壓迫感之社交場域')
c += body('國內實證研究指出，桌上遊戲能有效改善高齡者人際疏離與社會退縮等狀況（劉婕妤，2019）。本桌遊之機制設計旨在不著痕跡地引導玩家進行互動，避免高度仰賴口語表達之派對桌遊所賦予長者之過度社交壓力，以無負擔之形式實質提升長者之社會參與度與心理健康水準。')

# 伍
c += h1('伍、預期社會效益與社會影響力')
c += body('本計畫旨在建構一個從「個人身心賦能」、「實證數據衡量」到「社會系統優化」的全方位影響力桌游。我們透過具備醫學實證的創新介入模式，在提升長者社交尊嚴的同時，建立可量化的社會效益追蹤機制，為台灣超高齡社會提供可持續、可負擔且具備溫度的系統性解決方案。')
c += h2('一、對利害關係人的影響')
c += body('本計畫為社區長者提供安全、有趣且帶有復健效果的社交遊戲，並制定容易負擔的價格，確保一般據點與低收入家庭都有能力取得這套教具。')
c += h2('二、預期的社會改變與衡量方式')
c += body('本計畫採用雙軌指標衡量產品社會效益與市場接受度：量化指標透過逐月追蹤銷售數量與機構採用率評估市場滲透狀況；質化指標則建立定期回訪機制，向合作之安養中心與社福機構蒐集第一線回饋。計畫初期預計將產品導入 30 個高齡照護據點，每天約可服務 500 名長者。')
c += h2('三、社會問題的最終解決方案')
c += body('本計畫將為在地青年創造擔任樂齡帶領員的工作機會，促進地方就業與社區經濟獨立，並減輕高齡化社會帶來的醫療與照顧負擔。')

# 陸
c += h1('陸、財務永續性規劃')
c += h2('一、初期投資與資金用途')
c += body('以 2026 年為基期，初期資金預估用於公司開辦費用、購買初期設備（如 3D 列印機與模具驗證設備），以及作為營運週轉金。')
c += h2('二、營運支出預估')
c += body('主要涵蓋核心團隊人事費用、據點行銷推廣開銷、依據營收固定比例編列的研發費用，以及製作教具所需的木料與紙質材料費。')
c += h2('三、財務預測與永續發展')
c += body('計畫在未來五年內逐步擴大服務。第一年以 B2B 採購建立基礎營收（預計第一年銷售 50 套，第二年 100 套，逐年成長），在維持正向淨利的前提下逐年提高淨利率，確保財務永續性並持續擴大社會效益。')

# 柒
c += h1('柒、人力規劃')
c += body('團隊核心成員及其在計畫中負責的職責如下：')
c += body('周子謙（CEO）：負責管控整體專案時程、與外部長照機構洽談合作簽約，並主導公司願景發展與策略制定。')
c += body('周子謙（COO）：負責桌遊教具在線下據點的推廣、對接生產線與管理供應鏈，以及執行各項社區教學活動。')
c += body('王博宇（CFO）：負責初期資金管控、優化教具成本結構，並編列損益表與現金流量表。')
c += body('林心妍（CMO）：負責產品品牌包裝、接洽樂齡通路、經營線上社群，並推動募資專案。')

# 捌（移除，一行帶過）
c += h1('捌、物件卡、機會與命運')
c += body('完整的物件卡（27 張）、機會卡（15 張）及命運卡（14 張）玩法規則清單，請見另附之附件文件。')

# 玖（圖片）
c += h1('玖、產品參考圖')
c += h2('一、大富翁棋盤及卡片')
if len(extracted) >= 2:
    c += img_xml(extracted[0])
    c += img_xml(extracted[1])
elif len(extracted) == 1:
    c += img_xml(extracted[0])
c += h2('二、其他配件')
if len(extracted) >= 4:
    c += img_xml(extracted[2])
    c += img_xml(extracted[3])
elif len(extracted) == 3:
    c += img_xml(extracted[2])

# 拾（緊縮間距）
c += h1('拾、參考文獻')
c += h2('一、老年人口相關資料來源')
c += para('衛生福利部（2024）。衛生福利部公布最新臺灣社區失智症流行病學調查結果。取自 https://www.mohw.gov.tw/cp-6653-78102-1.html', indent=True, sa=40)
c += para('國家發展委員會（2018）。中華民國人口推估（2018至2065年）。取自 http://www.ndc.gov.tw/Content_List.aspx?n=695E69E28C6AC7F3', indent=True, sa=40)
c += h2('二、關於「雙重任務訓練」與「認知、體適能提升數據」的論文資料來源')
c += para('李佳穎（2026）。《雙重任務訓練改善認知障礙高齡者認知與體適能實證研究》。國立臺北護理健康大學。（未出版碩士學位論文）', indent=True, sa=40)
c += para('劉婕妤（2019）。《運用文獻回顧法探討桌上遊戲對延緩高齡者老化之應用成效》。南開科技大學福祉科技與服務管理系（碩士學位論文）', indent=True, sa=40)

# ── Assemble full document.xml ────────────────────────────────
sectPr = old_xml[old_xml.rfind('<w:sectPr'):]
new_xml = (
    old_xml[:old_xml.index('<w:body>') + len('<w:body>')] +
    cover_xml +
    c +
    sectPr +
    '\n  </w:body>\n</w:document>'
)

# Remove any stray </w:body></w:document> from sectPr duplication
new_xml = re.sub(r'</w:body>\s*</w:document>\s*</w:body>\s*</w:document>', '</w:body>\n</w:document>', new_xml)

with open(os.path.join(UNPACK_DIR, 'word', 'document.xml'), 'w', encoding='utf-8') as f:
    f.write(new_xml)
print('document.xml rebuilt')

# ══════════════════════════════════════════════════════════════
# STEP 5: Pack to docx
# ══════════════════════════════════════════════════════════════
with zipfile.ZipFile(OUT_PATH, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(UNPACK_DIR):
        for file in files:
            fpath = os.path.join(root, file)
            arcname = os.path.relpath(fpath, UNPACK_DIR)
            zf.write(fpath, arcname)

size = os.path.getsize(OUT_PATH)
print(f'Packed → {OUT_PATH}  ({size:,} bytes)')
print('ALL DONE.')
