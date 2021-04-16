// header
var MAX = 5; // default frequency that background music will be played automatically
var POSTER = 1; // slide show if POSTER > 1
var TIMING = MAX * 1000; // change poster every MAX seconds
var PLAY = 0;

// indexes of tuple
var TAG = 0; // HTML tags or other types
var BETWEEN = 1; // contents between tags
var HREF = 2;
var PG = 2; // page

// types of section
var VIDEO = "video";
var AUDIO = "audio";
var IMG = "img";
var P = "p";

var A = "a";
var BR = "br";
var I = "i";
var LI = "li";
var OL = "ol";
var SMALL = "small";
var STRONG = "strong";
var U = "u";
var UL = "ul";

var LB = [BR]; // line break
var PB = ["PB"]; // paragraph break
var BOOKMARK = "bookmark"; // bookmark in the same page
var PAGE = "page"; // page with ".html" extension
var PageID = "pageID";/////
var DOWNLOAD = "download";
var COMBINATION = "combination"; // combination of a link and a bookmark
var CombinationLink = 1;
var CombinationPath = 2;
var CombinationText = 3;
var CombinationBookmark = 4;
var CombinationID = 5;

var CONTENT = "N"; // NeiRong
var COMMENT = "P"; // PingLun

var FORMAT = {};
FORMAT[VIDEO] = "mp4";
FORMAT[AUDIO] = "mp3";
FORMAT[IMG] = "jpg";

// form
var LabelName = "labelName";
var LegendSex = "legendSex";
var LabelSex = ["female", "male", "secret"];
var LabelEmail = "labelEmail";
var LegendInterest = "legendInterest";
var LabelAdvice = "labelAdvice";
var FormButton = ["reset", "submit"];

// types of aside
var ID = 2;
var OTHERS = 3;
var SUBMENU = 2;

// Toggle Hide and Show
var SHOWN = "block";
var HIDDEN = "none";

// break
var LBH = "<br />"; // line break in HTML
var PBH = LBH + LBH; // paragraph break in HTML

// URL
var HTML = ".html";

var HTTPS = "https://";
var GITHUB = "-TV.github.io/";
var SG = HTTPS + "SG" + GITHUB;
var TW = HTTPS + "TW" + GITHUB;

var LANGUAGES =
{
//    de: "Deutsch",
    en: "English",
    es: "Español",
    fr: "Français",
//    it: "Italiano",
    ja: "日本語",
    ko: "한국어",
//    pt: "Português",
    zh: "中文"
};

var DICTIONARY =
{
    advice:
    {
        en: "Your Advice",
        es: "Tu Consejo",
        fr: "Votre Conseil",
        ja: "お問い合わせ",
        ko: "귀하의 조언",
        zh: "您的建议"
    },
    bookmark:
    {
        en: "This Page",
        es: "Esta Pagina",
        fr: "Cette Page",
        ja: "本ページ",
        ko: "본 페이지",
        zh: "本页面"
    },
    closingQuotation:
    {
        en: '"',
        es: '"',
        fr: '"',
        ja: '」',
        ko: '"',
        zh: '”'
    },
    colon:
    {
        en: ": ",
        es: ": ",
        fr: ": ",
        ja: "：",
        ko: ": ",
        zh: "："
    },
    comma:
    {
        en: ", ",
        es: ", ",
        fr: ", ",
        ja: "、",
        ko: ", ",
        zh: "、"
    },
    comment:
    {
        en: "My Comments",
        es: "Mis Comentarios",
        fr: "Mes Commentaires",
        ja: "コメント",
        ko: "내 의견",
        zh: "站长点评"
    },
    confirm:
    {
        en: "What you inputted are as follows",
        es: "Lo que ingresó son los siguientes",
        fr: "Ce que vous avez entré est le suivant",
        ja: "下記の内容で受け付けました",
        ko: "입력 한 내용은 다음과 같습니다",
        zh: "您输入了以下内容"
    },
    exampleEmail:
    {
        en: "your-name@github.com",
        es: "tu-nombre@github.com",
        fr: "votre-nom@github.com",
        ja: "onamae@github.com",
        ko: "dangsin-ui-ileum@github.com",
        zh: "本站不会自动发送验证邮件"
    },
    exampleName:
    {
        en: "Tom / Mary",
        es: "González",
        fr: "Pierre",
        ja: "ニックネームでもいいよ",
        ko: "박",
        zh: "免贵，姓"
    },
    female:
    {
        en: "Female",
        es: "Hembra",
        fr: "Femelle",
        ja: "女",
        ko: "여자",
        zh: "女"
    },
    footer:
    {
        en: "Please enjoy the above contents!",
        es: "¡Disfruta los contenidos anteriores!",
        fr: "Profitez du contenu ci-dessus, s'il vous plaît!",
        ja: "誠にありがとうございます！",
        ko: "위 내용을 즐기십시오！",
        zh: "希望您会欢喜以上内容！" + PBH +
            "在此对多媒体资源的提供者表示感谢！"
    },
    jj:
    {
        en: "Introduction",
        es: "Introducción",
        fr: "Introduction",
        ja: "はじめに",
        ko: "소개",
        zh: "简介"
    },
    labelAdvice:
    {
        en: "Advice",
        es: "Consejo",
        fr: "Conseil",
        ja: "アドバイス",
        ko: "조언",
        zh: "留言"
    },
    labelEmail:
    {
        en: "E-mail",
        es: "E-mail",
        fr: "E-mail",
        ja: "メールアドレス",
        ko: "이메일",
        zh: "邮箱"
    },
    labelName:
    {
        en: "Name",
        es: "Nombre",
        fr: "Nom",
        ja: "お名前",
        ko: "이름",
        zh: "贵姓"
    },
    legendInterest:
    {
        en: "Interests",
        es: "Intereses",
        fr: "Intérêts",
        ja: "興味",
        ko: "관심",
        zh: "喜欢的板块"
    },
    legendSex:
    {
        en: "Sex",
        es: "sexo",
        fr: "Sexe",
        ja: "性別",
        ko: "섹스",
        zh: "性别"
    },
    male:
    {
        en: "Male",
        es: "Masculino",
        fr: "Mâle",
        ja: "男",
        ko: "남성",
        zh: "男"
    },
    none:
    {
        en: "None",
        es: "Ninguno",
        fr: "Aucun",
        ja: "なし",
        ko: "없음",
        zh: "无"
    },
    openingQuotation:
    {
        en: '"',
        es: '"',
        fr: '"',
        ja: '「',
        ko: '"',
        zh: '“'
    },
    option:
    {
        en: "Language",
        es: "Idioma",
        fr: "Langue",
        ja: "言語",
        ko: "언어",
        zh: "语言"
    },
    reset:
    {
        en: "Reset",
        es: "Reiniciar",
        fr: "Réinitialiser",
        ja: "リセット",
        ko: "다시 놓기",
        zh: "重置"
    },
    secret:
    {
        en: "Secret",
        es: "secreto",
        fr: "Secret",
        ja: "教えない",
        ko: "비밀",
        zh: "不告诉你"
    },
    sibling:
    {
        en: "Others",
        es: "Otros",
        fr: "Autres",
        ja: "その他",
        ko: "다른",
        zh: "其它"
    },
    submenu:
    {
        en: "Submenu",
        es: "Submenú",
        fr: "Sous-Menu",
        ja: "サブメニュー",
        ko: "하위 메뉴",
        zh: "子菜单"
    },
    submit:
    {
        en: "Submit",
        es: "Enviar",
        fr: "Soumettre",
        ja: "送信",
        ko: "제출",
        zh: "提交"
    },
    succeeded:
    {
        en: "Your advice has been submitted successfully!",
        es: "¡Su consejo ha sido enviado con éxito!",
        fr: "Votre conseil a été soumis avec succès!",
        ja: "送信しました！ありがとうございました！",
        ko: "귀하의 조언이 성공적으로 제출되었습니다！",
        zh: "已成功提交！"
    },
    unavailable:
    {
        en: "(Unavailable now)",
        es: "(Ninguno por el momento)",
        fr: "(Aucun pour le moment)",
        ja: "（未登録）",
        ko: "（없음）",
        zh: "（暂无）"
    },
    zj:
    {
        en: "Conclusion",
        es: "Conclusión",
        fr: "Conclusion",
        ja: "おわりに",
        ko: "결론",
        zh: "总结"
    }
};
