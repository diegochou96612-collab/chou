# -*- coding: utf-8 -*-
"""
Build v3: 按照競賽規範重整
- 實物照片移入貳（產品內容）
- 代表性卡牌範例移入貳（壓縮）
- 移除獨立的捌、玖章節
- 參考文獻移至柒之後（最末頁）
- 輸出: 第六屆台灣尤努斯創新獎補交版本_v3.docx
"""
import os, zipfile, re, shutil
from PIL import Image

# ── Paths ─────────────────────────────────────────────────────
SRC_UNPACK = r'D:\周子謙\claude_code工作資料夾\unpacked_v1'
OUT_PATH   = r'D:\周子謙\claude_code工作資料夾\第六屆台灣尤努斯創新獎補交版本_v3.docx'

# Copy unpacked_v1 → unpacked_v3 (work on fresh copy)
DST_UNPACK = r'D:\周子謙\claude_code工作資料夾\unpacked_v3'
if os.path.exists(DST_UNPACK):
    shutil.rmtree(DST_UNPACK)
shutil.copytree(SRC_UNPACK, DST_UNPACK)
print('Copied to unpacked_v3')

# ── Image metadata ─────────────────────────────────────────────
imgs = []
for i in range(1, 5):
    path = os.path.join(DST_UNPACK, 'word', 'media', f'image{i}.png')
    with Image.open(path) as im:
        w, h = im.size
    # Scale: max 3,800,000 EMU wide × 2,600,000 EMU tall for inline photos
    max_w, max_h = 3800000, 2600000
    scale = min(max_w / w, max_h / h)
    imgs.append({
        'id': i, 'rid': f'rId{4+i}',
        'fname': f'image{i}.png',
        'cx': int(w * scale), 'cy': int(h * scale)
    })
    print(f'  image{i}: {w}x{h} → cx={int(w*scale)} cy={int(h*scale)}')

# ── XML helpers ────────────────────────────────────────────────
def esc(t):
    return t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')

def para(text, bold=False, indent=False, center=False, sa=60, sb=0, color='1F1F1F', small=False):
    sz_tag = '<w:sz w:val="18"/><w:szCs w:val="18"/>' if small else ''
    jc  = '<w:jc w:val="center"/>' if center else ''
    b   = '<w:b/>' if bold else ''
    pPr = f'<w:pPr><w:pStyle w:val="Default"/>{jc}<w:spacing w:before="{sb}" w:after="{sa}"/><w:rPr>{b}<w:color w:val="{color}"/>{sz_tag}</w:rPr></w:pPr>'
    rPr = f'<w:rPr>{b}<w:rFonts w:hint="eastAsia"/><w:color w:val="{color}"/>{sz_tag}</w:rPr>'
    prefix = esc('　　') if indent else ''
    return f'<w:p>{pPr}<w:r>{rPr}<w:t xml:space="preserve">{prefix}{esc(text)}</w:t></w:r></w:p>\n'

def h1(t):  return para(t, bold=True, sa=120, sb=240)
def h2(t):  return para(t, bold=True, sa=120, sb=240)
def h3(t):  return para(t, sa=120, sb=240)
def body(t): return para(t, indent=True, sa=60)
def sp():   return '<w:p><w:pPr><w:spacing w:after="80"/></w:pPr></w:p>\n'
def pb():   return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>\n'

def img_xml(img, center=True):
    jc = '<w:jc w:val="center"/>' if center else ''
    ns_a   = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
    ns_pic = 'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
    ns_r   = 'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
    ns_wp  = 'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"'
    return f'''<w:p>
  <w:pPr><w:pStyle w:val="Default"/>{jc}<w:spacing w:before="60" w:after="80"/></w:pPr>
  <w:r><w:rPr/><w:drawing>
    <wp:inline distT="0" distB="0" distL="0" distR="0" {ns_wp}>
      <wp:extent cx="{img['cx']}" cy="{img['cy']}"/>
      <wp:effectExtent l="0" t="0" r="0" b="0"/>
      <wp:docPr id="{img['id']}" name="Image{img['id']}" descr="產品圖片"/>
      <wp:cNvGraphicFramePr><a:graphicFrameLocks {ns_a} noChangeAspect="1"/></wp:cNvGraphicFramePr>
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

# ── BMC Table ──────────────────────────────────────────────────
CW, TC_L, TC_R = 8306, 2200, 6106

def bmc_row(label, lines, header=False):
    fill_l = '1F3864' if header else 'D6E4F0'
    fill_r = '1F3864' if header else 'FFFFFF'
    lcolor = 'FFFFFF' if header else '1F1F1F'
    rcolor = 'FFFFFF' if header else '1F1F1F'
    b = '<w:b/>'
    rb = b if header else ''
    marg = '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>'
    lc = f'<w:tc><w:tcPr><w:tcW w:w="{TC_L}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="{fill_l}"/>{marg}<w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr>{b}<w:rFonts w:hint="eastAsia"/><w:color w:val="{lcolor}"/></w:rPr><w:t>{esc(label)}</w:t></w:r></w:p></w:tc>'
    paras = ''
    for i, line in enumerate(lines):
        sa2 = '60' if i < len(lines)-1 else '0'
        jc2 = 'center' if header else 'left'
        paras += f'<w:p><w:pPr><w:spacing w:after="{sa2}"/><w:jc w:val="{jc2}"/></w:pPr><w:r><w:rPr>{rb}<w:rFonts w:hint="eastAsia"/><w:color w:val="{rcolor}"/></w:rPr><w:t>{esc(line)}</w:t></w:r></w:p>'
    rc = f'<w:tc><w:tcPr><w:tcW w:w="{TC_R}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="{fill_r}"/>{marg}</w:tcPr>{paras}</w:tc>'
    return f'<w:tr>{lc}{rc}</w:tr>\n'

def bmc_table():
    borders = '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="999999"/><w:left w:val="single" w:sz="4" w:color="999999"/><w:bottom w:val="single" w:sz="4" w:color="999999"/><w:right w:val="single" w:sz="4" w:color="999999"/><w:insideH w:val="single" w:sz="4" w:color="999999"/><w:insideV w:val="single" w:sz="4" w:color="999999"/></w:tblBorders>'
    rows = bmc_row('要素', ['內容說明'], header=True)
    data = [
        ('關鍵合作夥伴', ['高齡日間照顧中心、長青學苑、社區發展協會、樂齡教具經銷商、政府長照單位，以及職能治療師協會']),
        ('關鍵活動',   ['持續研發與優化教具及天秤機構；舉辦社區據點推廣體驗會；辦理高齡桌遊指導員培訓課程']),
        ('價值主張',   ['提供市面少見的「雙效合一」樂齡教具。單一遊戲即可同步鍛鍊「短期記憶力」與「手部精細肌肉」，有效訓練長者本體感覺並大幅降低遊玩挫折感']),
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

def card_sample_table():
    """代表性卡牌範例（小字壓縮）"""
    borders = '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="BBBBBB"/><w:left w:val="single" w:sz="4" w:color="BBBBBB"/><w:bottom w:val="single" w:sz="4" w:color="BBBBBB"/><w:right w:val="single" w:sz="4" w:color="BBBBBB"/><w:insideH w:val="single" w:sz="4" w:color="BBBBBB"/><w:insideV w:val="single" w:sz="4" w:color="BBBBBB"/></w:tblBorders>'
    marg = '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar>'
    sz  = '<w:sz w:val="18"/><w:szCs w:val="18"/>'  # 9pt
    COL = CW // 3

    def hdr_row(t1, t2, t3):
        def hc(text, w):
            return f'<w:tc><w:tcPr><w:tcW w:w="{w}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="D6E4F0"/>{marg}</w:tcPr><w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:hint="eastAsia"/>{sz}</w:rPr><w:t>{esc(text)}</w:t></w:r></w:p></w:tc>'
        return f'<w:tr>{hc(t1,COL)}{hc(t2,COL)}{hc(t3,COL)}</w:tr>\n'

    def data_row(t1, t2, t3):
        def dc(text, w):
            return f'<w:tc><w:tcPr><w:tcW w:w="{w}" w:type="dxa"/>{marg}</w:tcPr><w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:hint="eastAsia"/>{sz}</w:rPr><w:t>{esc(text)}</w:t></w:r></w:p></w:tc>'
        return f'<w:tr>{dc(t1,COL)}{dc(t2,COL)}{dc(t3,COL)}</w:tr>\n'

    rows  = hdr_row('物件卡（共27張）', '機會卡（共15張）範例', '命運卡（共14張）範例')
    rows += data_row('茶杯、眼鏡、雨傘、拖鞋、收音機、紅包袋、帽子、藥丸、牙刷、鏡子、磁鐵、蠟燭、菜籃、椅子、床、掃把、水桶、手電筒、念珠、圍巾、手套、布鞋、背包、針線、報紙、體溫計、聽診器',
                     '・閉眼觸摸硬幣猜正反，對則前進1格\n・說出3種紅色蔬果，成功前進1格\n・10秒內連續翻幣3次，成功前進1格\n・天秤兩端掛砝碼達平衡，前進1格\n・稱讚右手邊玩家，兩人皆前進1格',
                     '・說出上一張物件卡，錯退1格\n・閉眼指出大門方向，對進1錯退1\n・所有未翻牌隨機交換位置\n・強制用非慣用手抽積木\n・下回合結束前不能出聲')
    return f'<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="{CW}" w:type="dxa"/>{borders}<w:tblLook w:val="0000"/></w:tblPr><w:tblGrid><w:gridCol w:w="{COL}"/><w:gridCol w:w="{COL}"/><w:gridCol w:w="{COL}"/></w:tblGrid>{rows}</w:tbl>\n'

# ══════════════════════════════════════════════════════════════
# Build new body content
# ══════════════════════════════════════════════════════════════
with open(os.path.join(DST_UNPACK, 'word', 'document.xml'), 'r', encoding='utf-8') as f:
    old_xml = f.read()

body_start = old_xml.index('<w:body>') + len('<w:body>')
pb_pos     = old_xml.index('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
cover_xml  = old_xml[body_start:pb_pos]

c = pb()

# ── 壹 ────────────────────────────────────────────────────────
c += h1('壹、欲解決的社會問題')
c += h2('一、高齡化帶來的認知退化危機與現有困境')
c += body('台灣正加速邁入超高齡社會，長者的認知與生理機能退化，已成為無可迴避的社會挑戰。根據衛福部最新的全國社區失智症流行病學調查，全台失智人口已正式突破 38 萬人（衛生福利部，2024），未來幾年內更預估將逼近 50 萬人大關（國家發展委員會，2018）。')
c += body('然而，當前傳統單一的身體活動或單一認知訓練效果有限，無法模擬日常生活的多工需求。在藥物治療無法完全解決問題的情況下，非藥物介入的需求極為迫切；且目前社區場域（如日照中心）普遍缺乏標準化且有實證支持的介入模式，顯示市場對於創新延緩高齡認知退化方案的需求極為迫切。')
c += h2('二、田野訪談與真實痛點發掘')
c += body('為了確實掌握潛在用戶的真實需求，團隊於開發初期針對 50 至 70 歲的初老與銀髮族群發放了 Google 網路問卷進行市場調查。起初，我們的構想是開發一款協助長輩日常生活的數位 LINE Bot，但在大量彙整這群真實長輩的反饋後，我們察覺到了市場真正的缺口。')
c += body('問卷與後續的訪談結果顯示，目前市面的高齡健康促進輔具多半功能單一。長輩們反映，純認知型的益智遊戲或數位介面，常因缺乏肢體動作的實體回饋，容易讓長輩感到乏味而產生抗拒；許多長輩更因手部顫抖等生理限制，在參與現有遊戲過程中頻頻受挫，最終排斥參與任何社群互動。這些第一手調查反饋，促使團隊轉而打造能兼顧「實體肢體回饋」與「防挫折機制」的健康促進桌遊。')
c += h2('三、團隊解方與計畫可實現性')
c += body('針對上述痛點，本計畫量身打造了一款專屬高齡者的互動桌遊。在技術可行性上，團隊已自行掌握核心的「觸覺天秤機構」與「聲音反饋裝置」等開發技術。同時，為確保產品符合臨床醫學原理，亦邀請高齡心理與職能治療專家擔任顧問進行監修。透過遊戲中高頻率、低門檻的正向回饋機制，期望能有效延緩長輩的認知退化，並大幅降低挫折感與孤立感。')

# ── 貳 ───────────────────────────────────────────────────────
c += h1('貳、公司目標、願景與產品內容')
c += h2('一、產品與服務內容')
c += body('本產品是一款特別為長者打造的多功能桌遊教具，主要包含以下三個核心遊戲機制：')
c += h3('（一）大富翁式棋盤與記憶挑戰')
c += body('遊戲地圖設計為 12 格的正方形。其中 8 格放置生活常見物品的記憶卡片，長者需記住圖案後將卡片蓋上；另包含 3 格「機會與命運」及 1 格起點。代表性卡牌範例詳見本節末表格。')
c += h3('（二）雙硬幣隨機遊戲機制')
c += body('捨棄傳統骰子，改用拋擲兩枚硬幣來決定玩家行動。若擲出兩面人頭，玩家前進兩格；若擲出兩面數字，玩家留在原地但可翻看一張牌；若擲出一頭一數字，玩家前進一格並需進行「抽積木」挑戰——積木塔倒塌則遊戲結束，若未倒則可再前進一格，但必須正確說出下一格覆蓋的卡牌內容。')
c += h3('（三）防挫折的創新觸覺天秤機制')
c += body('考量到部分長者可能因手部顫抖而感到挫折，設計了「感官天秤挑戰」作為替代方案。天秤桿子上設有多個孔洞，長者需把沒有標示重量的砝碼掛上去，依靠觸覺感受重量。若掛放不當導致天秤過度歪斜，裝置會發出輕脆的「咖」機械聲，代表挑戰失敗。')
c += h3('（四）產品原型操作與演示影片')
c += body('影片連結：https://youtu.be/RjYGkB2AUt8（待填入）。影片實際示範了桌遊中的雙硬幣機制、記憶卡牌的覆蓋操作，以及無標示砝碼的天秤挑戰，並收錄了天秤失去平衡時所發出的溫和機械音「喀」聲回饋。')
c += h3('（五）實物原型與初步驗證成果')
c += body('以下為團隊自行製作之實物原型照片，展示桌遊棋盤、機會命運卡牌、天秤機構及砝碼組件的實際成品：')
# 2×2 image layout: image1(棋盤) image2(卡牌) image3(天秤) image4(砝碼)
c += img_xml(imgs[0])  # 棋盤
c += img_xml(imgs[1])  # 卡牌
c += img_xml(imgs[2])  # 天秤
c += img_xml(imgs[3])  # 砝碼
c += h3('（六）代表性卡牌範例')
c += body('本桌遊共包含物件卡 27 張、機會卡 15 張、命運卡 14 張，以下為各類型代表性範例：')
c += sp()
c += card_sample_table()
c += sp()

c += h2('二、公司目標與願景')
c += h3('（一）營運目標')
c += body('建立並優化標準化的教具生產流程。預計在第一年內完成產品最終改良與量產，並推廣至全台灣至少 50 個社區照顧關懷據點與日照中心。')
c += h3('（二）社會使命')
c += body('以社會企業模式經營。所有利潤都將重新投入研發，致力開發更適合高齡者的無障礙遊戲輔具，回饋給更多受高齡化影響的社區。')
c += h3('（三）長期願景')
c += body('目標在五年內，把這套產品推廣到全台各鄉鎮的樂齡學習中心，打造跨世代共遊、沒有年齡隔閡的健康老化環境。')

# ── 參（表格）────────────────────────────────────────────────
c += h1('參、商業模式')
c += body('本計畫採行「B2B 機構推廣為主、B2C 終端銷售為輔」的雙軌營運策略。透過機構的常態性應用建立產品口碑，並以「直接採購與長期租賃」並行的彈性方案，為團隊挹注穩定且具延續性的現金流。')
c += sp()
c += bmc_table()
c += sp()

# ── 肆 ────────────────────────────────────────────────────────
c += h1('肆、計畫創新性與獨特性')
c += h2('一、打破單一訓練侷限，手腦結合的雙重刺激任務訓練')
c += body('本計畫導入「雙重任務訓練」的實證概念，將注意力（雙硬幣驅動）、記憶力（卡牌位置記憶）、語言能力（口語表達卡牌內容）以及建構定義能力完美結合，促使高齡者同步執行認知性與動作性任務。國內臨床研究證實，經八週訓練後長者在 MMSE 記憶力分數呈現顯著成長，MoCA 延遲記憶分數亦達顯著進步，上下肢肌力皆有提升（李佳穎，2026）。本產品深度整合手部精細肌肉之微控機制，達成全面性大腦與末梢神經活化。')
c += h2('二、構築高頻率之正向心理回饋機制')
c += body('本計畫刻意屏除易引發長者強烈挫折感之懲罰機制，轉而導入短時效且高頻次之正向回饋系統。當天秤挑戰失衡時，裝置僅釋放溫和之機械「喀」聲作為警示，確保長者得以於極短時間內獲取成就感，大幅優化反覆遊玩之黏著度與遵從性（劉婕妤，2019）。')
c += h2('三、營造自然且無壓迫感之社交場域')
c += body('本桌遊之機制設計旨在不著痕跡地引導玩家進行互動，避免高度仰賴口語表達之派對桌遊所賦予長者之過度社交壓力，以無負擔之形式實質提升長者之社會參與度與心理健康水準（劉婕妤，2019）。')

# ── 伍 ────────────────────────────────────────────────────────
c += h1('伍、預期社會效益與社會影響力')
c += body('本計畫旨在建構一個從「個人身心賦能」、「實證數據衡量」到「社會系統優化」的全方位影響力桌游，透過具備醫學實證的創新介入模式，為台灣超高齡社會提供可持續、可負擔且具備溫度的系統性解決方案。')
c += h2('一、對利害關係人的影響')
c += body('本計畫為社區長者提供安全、有趣且帶有復健效果的社交遊戲，並制定容易負擔的價格，確保一般據點與低收入家庭都有能力取得這套教具。')
c += h2('二、預期的社會改變與衡量方式')
c += body('採用雙軌指標衡量社會效益：量化方面逐月追蹤銷售數量與機構採用率；質化方面建立定期回訪機制，蒐集第一線照護者回饋。計畫初期預計導入 30 個高齡照護據點，每天約可服務 500 名長者。')
c += h2('三、社會問題的最終解決方案')
c += body('本計畫將為在地青年創造擔任樂齡帶領員的工作機會，促進地方就業與社區經濟獨立，並減輕高齡化社會帶來的醫療與照顧負擔。')

# ── 陸 ────────────────────────────────────────────────────────
c += h1('陸、財務永續性規劃')
c += h2('一、初期投資與資金用途')
c += body('以 2026 年為基期，初期資金預估用於公司開辦費用、購買初期設備（如 3D 列印機與模具驗證設備），以及作為營運週轉金。')
c += h2('二、營運支出預估')
c += body('主要涵蓋核心團隊人事費用、據點行銷推廣開銷、依據營收固定比例編列的研發費用，以及製作教具所需的木料與紙質材料費。')
c += h2('三、財務預測與永續發展')
c += body('預計第一年銷售 50 套、第二年 100 套，逐年成長。在維持正向淨利的前提下逐年提高淨利率，確保財務永續性並持續擴大社會效益。')

# ── 柒 ────────────────────────────────────────────────────────
c += h1('柒、人力規劃')
c += body('周子謙（CEO）：負責管控整體專案時程、與外部長照機構洽談合作簽約，並主導公司願景發展與策略制定。')
c += body('周子謙（COO）：負責桌遊教具在線下據點的推廣、對接生產線與管理供應鏈，以及執行各項社區教學活動。')
c += body('王博宇（CFO）：負責初期資金管控、優化教具成本結構，並編列損益表與現金流量表。')
c += body('林心妍（CMO）：負責產品品牌包裝、接洽樂齡通路、經營線上社群，並推動募資專案。')

# ── 參考文獻（最末，緊縮）────────────────────────────────────
c += h1('參考文獻')
c += para('衛生福利部（2024）。衛生福利部公布最新臺灣社區失智症流行病學調查結果。取自 https://www.mohw.gov.tw/cp-6653-78102-1.html', indent=True, sa=40)
c += para('國家發展委員會（2018）。中華民國人口推估（2018至2065年）。取自 http://www.ndc.gov.tw/Content_List.aspx?n=695E69E28C6AC7F3', indent=True, sa=40)
c += para('李佳穎（2026）。《雙重任務訓練改善認知障礙高齡者認知與體適能實證研究》。國立臺北護理健康大學（未出版碩士學位論文）。', indent=True, sa=40)
c += para('劉婕妤（2019）。《運用文獻回顧法探討桌上遊戲對延緩高齡者老化之應用成效》。南開科技大學福祉科技與服務管理系（碩士學位論文）。', indent=True, sa=40)

# ── Assemble document.xml ─────────────────────────────────────
sectPr  = old_xml[old_xml.rfind('<w:sectPr'):]
# Remove any trailing </w:body></w:document> from sectPr if present
sectPr  = re.sub(r'</w:body>.*', '', sectPr, flags=re.DOTALL)

new_xml = (
    old_xml[:old_xml.index('<w:body>') + len('<w:body>')] +
    cover_xml + c +
    sectPr +
    '</w:body>\n</w:document>'
)

with open(os.path.join(DST_UNPACK, 'word', 'document.xml'), 'w', encoding='utf-8') as f:
    f.write(new_xml)
print('document.xml written')

# ── Pack ──────────────────────────────────────────────────────
with zipfile.ZipFile(OUT_PATH, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(DST_UNPACK):
        for file in files:
            fpath   = os.path.join(root, file)
            arcname = os.path.relpath(fpath, DST_UNPACK)
            zf.write(fpath, arcname)

print(f'Done → {OUT_PATH}  ({os.path.getsize(OUT_PATH):,} bytes)')
