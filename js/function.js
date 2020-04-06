function getPage(url)
{
    var i = 0;
    var splitURL = url.split("/");
    var last = splitURL.length - 1;
    var nodes = []; // effective nodes
    var node = "";
    var page =
    {
        language: "",
        top: "", // top menu, used to highlight the current NAV link
        name: splitURL[last].split(".").shift(),
        prefix: "", // prefix to go up directories
        path: "", // effective path without extension
        parent: DATA, // parent node in the DATA
        main: {}/////tobedeleted
    };
    page.top = page.name;
    page.path = page.name;
    for (i = last - 1; i >= 0; i--)
    {
        page.prefix += "../";
        if (splitURL[i] in LANGUAGES)
        {
            page.language = splitURL[i];
            break;
        }
        else
        {
            page.top = splitURL[i];
            nodes.unshift(splitURL[i]);
            page.path = splitURL[i] + "/" + page.path;
        }
    }
    for (node of nodes) page.parent = page.parent[node].aside;
    page.main = page.parent[page.name].main;/////tobedeleted
    return page;
}

function getRandomInteger(max) // [0, max)
{
    return Math.floor(Math.random() * max);
}

function shuffle(original)
{
    var i = 0;
    var j = 0; // index of the item to be swapped
    var t = ""; // temporary variable
    var shuffled = original.slice(0); // clone and not change the original array
    for (i = original.length - 1; i > 0; i--)
    {
        j = getRandomInteger(i + 1);
        if (i != j)
        {
            t = shuffled[j];
            shuffled[j] = shuffled[i];
            shuffled[i] = t;
        }
    }
    return shuffled;
}

function getLink(prefix, folder, file)
{
    return prefix + folder + "/" + file;
}

function getMultimediaLink(page, type, baseName)
{
    return getLink(page.prefix, type, page.path + "/" + baseName + "." + FORMAT[type]);
}

function mergeLanguage(languageInfo, language) // return a string
{
    if ("string" === typeof languageInfo) return languageInfo; // for all languages
    else
        if (language in languageInfo) return languageInfo[language];
        else
            if ("os" in languageInfo) return languageInfo.os; // "os" means OTHERS.
            else return DICTIONARY.unavailable[language];
}

function getHeading(page)
{
    var pageInfo = page.parent[page.name];
    var headerInfo = pageInfo.header;
    var headingInfo = "";
    if ("h1" in headerInfo)
    {
        headingInfo = mergeLanguage(headerInfo.h1, page.language);
        if
        (
            DICTIONARY.unavailable[page.language] === headingInfo &&
            "nav" in pageInfo
        ) return mergeLanguage(pageInfo.nav, page.language);
        else return headingInfo;
    }
    else return mergeLanguage(pageInfo.nav, page.language);
}

/*
There is no problem in the following function if the initial state is HIDDEN in CSS.
If it is SHOWN, button must be clicked twice for the 1st toggling.
Swap SHOWN & HIDDEN to fix the problem.
*/
function showORhide(element)
{
    if (SHOWN === element.style.display) element.style.display = HIDDEN;
    else element.style.display = SHOWN;
}

function showSlides(slide, i)
{
    var j = i + 1;
    if (slide.length == j) j = 0;
    showORhide(slide[i]);
    showORhide(slide[j]);
    setTimeout(showSlides, TIMING, slide, j);
}

function followedByColon(text, language)
{
    return DICTIONARY[text][language] + DICTIONARY.colon[language];
}

function createMenus(page, path, parent) // create menus recursively
{
    var ul = document.createElement(UL);
    var li;
    var a; // anchor
    
    var menu = "";
    var child = {};
    var currentPath = "";
    var submenu;
    
    for ([menu, child] of Object.entries(parent))
        if (OTHERS == child.aside) break; // Other ASIDEs need not checking because the values of them must also be OTHERS.
        else
        {
            li = document.createElement(LI);
            a = document.createElement(A);
            currentPath = path + menu;
            
            if (page.top === currentPath)
            {
                a.style.backgroundColor = "red";
                a.style.color = "yellow";
            }
            
            if (page.path !== currentPath) a.href = page.prefix + page.language + "/" + currentPath + HTML;
            a.innerHTML = mergeLanguage(child.nav, page.language);
            li.appendChild(a);
            
            if ("object" === typeof child.aside)
            {
                submenu = createMenus(page, currentPath + "/", child.aside);
                if (submenu.hasChildNodes()) li.appendChild(submenu);
            }
            ul.appendChild(li);
        }
    
    return ul;
}

function createMultimedia(page, type, baseName)
{
    var multimedia = document.createElement(type);
    
    multimedia.src = getMultimediaLink(page, type, baseName);
    
    if (IMG !== type)
    {
        multimedia.controls = true;
        multimedia.onmouseenter = function()
        {
            multimedia.play();
        };
    }
    
    return multimedia;
}

function transform2a(between, href)
{
    return [A, between, href];
}

function transformTag(page, original, parent)
{
    var transformed = [];
    
    switch (original[TAG])
    {
        case PB[0]: // paragraph break
            parent.appendChild(document.createElement(BR));
            transformed = LB;
            break;
        case BOOKMARK: // bookmark in the same page
            transformed = transform2a(original[BETWEEN], "#" + original[HREF]);
            break;
        case PAGE: // page with ".html" extension
            transformed = transform2a(original[BETWEEN], original[PG] + HTML);
            break;
        case DOWNLOAD:
            transformed = transform2a
            (
                original[BETWEEN],
                getLink(page.prefix, DOWNLOAD, page.path + "/" + original[HREF])
            );
            break;
        case COMBINATION: // divide the original array into thirds
            transformed =
            [
                A,
                original[CombinationLink],
                original[CombinationPath]
            ];
            createParagraph(page, [transformed], parent); // link
            
            createParagraph(page, original[CombinationText], parent); // text betwwen link & bookmark
            
            transformed = // return the bookmark
            [
                A,
                original[CombinationBookmark],
                original[CombinationPath] + "#" + original[CombinationID]
            ];
            break;
        default:
            transformed = original;
    }
    
    return transformed;
}

function createList(page, list, parent) // "list" is an array.
{
    var li; // string or array
    
    for (li of list) createParagraph(page, [[LI, li]], parent);
}

function createParagraph(page, paragraph, parent)
{
    var pa; // string or array
    var transformed;
    var element;
    
    if ("string" === typeof paragraph) parent.appendChild(document.createTextNode(paragraph));
    else // array
        for (pa of paragraph)
            if ("string" === typeof pa) parent.appendChild(document.createTextNode(pa));
            else // array
            {
                transformed = transformTag(page, pa, parent); // transform pa into an HTML tag if necessary
                element = document.createElement(transformed[TAG]);
                
                switch (transformed[TAG])
                {
                    case BR:
                        break;
                    case OL:
                    case UL:
                        createList(page, transformed[BETWEEN], element);
                        break;
                    case A:
                        element.href = transformed[HREF];
                    default:
                        createParagraph(page, transformed[BETWEEN], element);
                }
                parent.appendChild(element);
            }
}

function createSection(page, currentArticle, co__ent, id) // "co__ent" means content or comment.
{
    var section = document.createElement("section");
    var type;
    
    var element = []; // a tuple, an array of 1 or 2 item(s)
    var tag = "";
    var middle = ""; // CONTENT or COMMENT
    var between; // string or array
    var serialNumber = {};
    
    if (co__ent in currentArticle)
    {
        serialNumber[VIDEO] = 0; // serial number of video
        serialNumber[AUDIO] = 0; // serial number of audio
        serialNumber[IMG] = 0; // serial number of image
        
        for (element of currentArticle[co__ent]) // "currentArticle[co__ent]" is an array, consisting of some tuples.
        {
            tag = element[TAG];
            
            switch (tag)
            {
                case VIDEO:
                case AUDIO:
                case IMG:
                    if ("content" === co__ent) middle = CONTENT;
                    if ("comment" === co__ent) middle = COMMENT;
                    
                    type = createMultimedia(page, tag, id + middle + serialNumber[tag]);
                    serialNumber[tag] += 1;
                    break;
                default: // paragraph
                    type = document.createElement(P);
                    between = element[BETWEEN];
                    
                    if (page.language in between) createParagraph(page, between[page.language], type);
                    else type.innerHTML = [DICTIONARY.unavailable[page.language]];
            }
            section.appendChild(type);
        }
    }
    else
    {
        type = document.createElement(P);
        type.innerHTML = DICTIONARY.unavailable[page.language];
        section.appendChild(type);
    }
    
    return section;
}

function createForm(page, articleID)
{
    var form = document.createElement("form");
    var labelName = document.createElement("label");
    var inputName = document.createElement("input");
    var fieldset = document.createElement("fieldset"); // for sex & interest
    var legendSex = document.createElement("legend");
    var inputSex = []; // radio
    var labelSex = [];
    var labelEmail = document.createElement("label");
    var inputEmail = document.createElement("input");
    var legendInterest = document.createElement("legend");
    var inputInterest = []; // checkbox
    var labelInterest = [];
    var labelAdvice = document.createElement("label");
    var textarea = document.createElement("textarea"); // advice
    var input; // for submit & reset
    
    var i;
    var interests = Object.keys(DATA);
    var fb = "";
    
// name
    labelName.htmlFor = articleID + LabelName;
    labelName.innerHTML = followedByColon(LabelName, page.language);
    form.appendChild(labelName);
    
    inputName.type = "text";
    inputName.id = labelName.htmlFor;
    inputName.required = true;
    inputName.placeholder = DICTIONARY.exampleName[page.language];
    form.appendChild(inputName);
    
// sex
    legendSex.innerHTML = followedByColon(LegendSex, page.language);
    fieldset.appendChild(legendSex);
    
    for (i in LabelSex)
    {
        inputSex[i] = document.createElement("input");
        inputSex[i].type = "radio";
        inputSex[i].name = LegendSex;
        inputSex[i].id = articleID + LabelSex[i];
        inputSex[i].required = true;
        fieldset.appendChild(inputSex[i]);
        
        labelSex[i] = document.createElement("label");
        labelSex[i].htmlFor = inputSex[i].id;
        labelSex[i].innerHTML = DICTIONARY[LabelSex[i]][page.language];
        fieldset.appendChild(labelSex[i]);
    }
    
    form.appendChild(fieldset);
    
// E-mail
    labelEmail.htmlFor = articleID + LabelEmail;
    labelEmail.innerHTML = followedByColon(LabelEmail, page.language);
    form.appendChild(labelEmail);
    
    inputEmail.type = "email";
    inputEmail.id = labelEmail.htmlFor;
    inputEmail.required = true;
    inputEmail.placeholder = DICTIONARY.exampleEmail[page.language];
    form.appendChild(inputEmail);
    
// interest
    fieldset = document.createElement("fieldset");
    
    legendInterest.innerHTML = followedByColon(LegendInterest, page.language);
    fieldset.appendChild(legendInterest);
    
    for (i in interests)
    {
        inputInterest[i] = document.createElement("input");
        inputInterest[i].type = "checkbox";
        inputInterest[i].name = LegendInterest;
        inputInterest[i].id = articleID + interests[i];
        fieldset.appendChild(inputInterest[i]);
        
        labelInterest[i] = document.createElement("label");
        labelInterest[i].htmlFor = inputInterest[i].id;
        labelInterest[i].innerHTML = DATA[interests[i]].nav[page.language]; // need not use "mergeLanguage"
        fieldset.appendChild(labelInterest[i]);
    }
    
    form.appendChild(fieldset);
    
// advice
    labelAdvice.htmlFor = articleID + LabelAdvice;
    labelAdvice.innerHTML = followedByColon(LabelAdvice, page.language);
    form.appendChild(labelAdvice);
    
    textarea.id = labelAdvice.htmlFor;
    textarea.required = true;
    textarea.value = getHeading(page);
    form.appendChild(textarea);
    
// reset & submit
    for (fb of FormButton)
    {
        input = document.createElement("input");
        
        input.type = fb;
        input.value = DICTIONARY[fb][page.language];
        form.appendChild(input);
    }
    
// onsubmit
    form.onsubmit = function()
    {
        var inputtedContents =
                DICTIONARY.confirm[page.language] +
                "\n\n" +
                labelName.innerHTML +
                inputName.value;
        var checkedInterests = "";
        
        inputtedContents += "\n" + legendSex.innerHTML;
        for (i in LabelSex)
            if (inputSex[i].checked)
            {
                inputtedContents += labelSex[i].innerHTML;
                break;
            }
        
        inputtedContents += "\n" + labelEmail.innerHTML + inputEmail.value;

        inputtedContents += "\n" + legendInterest.innerHTML;
        for (i in interests)
            if (inputInterest[i].checked)
                checkedInterests += labelInterest[i].innerHTML + DICTIONARY.comma[page.language];
        if (0 == checkedInterests.length) inputtedContents += DICTIONARY.none[page.language];
        else inputtedContents += checkedInterests.trim().slice(0, -1); // trim() is used to remove whitespace at the end.
        
        inputtedContents += "\n" + labelAdvice.innerHTML + textarea.value;
        
        if (confirm(inputtedContents)) alert(DICTIONARY.succeeded[page.language]);
        
        return false; // prevent the page being reloaded
    };
    
    return form;
}

function createArticle(page, id, parent) // ID of article
{
    var article = document.createElement("article");
    var h2 = document.createElement("h2"); // heading 2
    var h3; // heading 3
    var content;
    var comment;
    var button = document.createElement("button");
    
    var currentArticle = page.parent[page.name].main[id];
    var form = createForm(page, id);
    
// create bookmarks with ID attribute
    article.id = id;
    
// heading 2
    if ("h2" in currentArticle) h2.innerHTML = mergeLanguage(currentArticle.h2, page.language);
    else h2.innerHTML = DICTIONARY[id][page.language]; // Introduction or Conclusion
    article.appendChild(h2);
    
// heading 3
    if ("h3" in currentArticle)
    {
        h3 = document.createElement("h3");
        h3.innerHTML =
            DICTIONARY.openingQuotation[page.language] +
            mergeLanguage(currentArticle.h3, page.language) +
            DICTIONARY.closingQuotation[page.language];
        article.appendChild(h3);
    }
    
// content
    content = createSection(page, currentArticle, "content", id);
    article.appendChild(content);
    
// left button
    button.innerHTML = DICTIONARY.comment[page.language];
    button.onclick = function()
    {
        showORhide(comment);
    };
    article.appendChild(button);
    
// right button
    button = document.createElement("button");
    button.innerHTML = DICTIONARY.advice[page.language];
    button.style.float = "right";
    button.onclick = function()
    {
        showORhide(form);
    };
    article.appendChild(button);
    
// comment
    comment = createSection(page, currentArticle, "comment", id);
    comment.style.display = HIDDEN;
    article.appendChild(comment);
    
    article.appendChild(form);
    parent.appendChild(article);
}

function createAsideIDlist(bookmark, text, parent)
{
    var li = document.createElement(LI);
    var a = document.createElement(A); // anchor
    
    a.href = "#" + bookmark;
    a.innerHTML = text;
    li.appendChild(a);
    parent.appendChild(li);
}

function appendAsideEitherSide(bookmark, language, parent) // introduction & conclusion
{
    createAsideIDlist(bookmark, DICTIONARY[bookmark][language], parent);
}

function createNav(page)
{
    var nav = document.createElement("nav");
    var ul = document.createElement(UL);
    var li;
    var a; // anchor
// multi-language options
    var language = "";
    var languages = shuffle(Object.keys(LANGUAGES));
    
    for (language of languages)
    {
        li = document.createElement(LI);
        a = document.createElement(A);
        
        if (page.language !== language) a.href = page.prefix + language + "/" + page.path + HTML;
        
        a.innerHTML = LANGUAGES[language];
        li.appendChild(a); // "a" will become useless after the last A is appended.
        ul.appendChild(li); // So it is with "li".
    }

    li = document.createElement(LI); // So "li" can be used again.
    a = document.createElement(A); // So it is with "a".
    a.innerHTML = DICTIONARY.option[page.language];
    li.appendChild(a);
    li.appendChild(ul); // "ul" will become useless after UL is appended.
    
    ul = createMenus(page, "", DATA); // So "ul" can be used again.
    ul.appendChild(li); // add options to top NAV bar
    nav.appendChild(ul);
    document.body.appendChild(nav);
}

function createHeader(page)
{
    var header = document.createElement("header");
    var h1 = document.createElement("h1"); // heading 1
    var image;
    var audio;
    
    var headerInfo = page.parent[page.name].header;
    var imgNo = 0; // number of images
    var i;
    var last = -1; // index of the last image
    
    h1.innerHTML = getHeading(page);
    header.appendChild(h1);
    
    if ("img" in headerInfo)
    {
        imgNo = headerInfo.img;
        
        if (POSTER == imgNo)
        {
            image = createMultimedia(page, IMG, "header");
            header.appendChild(image);
        }
        else if (imgNo > POSTER)
        {
            image = [];
            last = imgNo - 1;
            
            for (i = 0; i < imgNo; i++)
            {
                image[i] = createMultimedia(page, IMG, "header" + i); // The filenames of images begin from "header0.jpg".
                image[i].style.display = HIDDEN;
                header.appendChild(image[i]);
            }
            
            image[last].style.display = SHOWN;
            showSlides(image, last);
        }
    }
    
    if ("bgSound" in headerInfo)
    {
        if (PLAY == getRandomInteger(headerInfo.bgSound)) // probability = 1 / headerInfo.bgSound
        {
            audio = document.createElement(AUDIO);
            audio.src = getMultimediaLink(page, AUDIO, "header");
            audio.autoplay = true;
            header.appendChild(audio);
        }
    }
    
    document.body.appendChild(header);
}

function createHalfPage(url) // set link & title; create NAV & HEADER
{
    var page = getPage(url);
    var link = document.createElement("link");
    
// link CSS
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = getLink(page.prefix, "css", "hobby.css");
    document.head.appendChild(link);
    
// title
    document.title = getHeading(page);
    
// create half page
    createNav(page);
    createHeader(page);
    
    return page;
}

function createMain(page)
{
    var main = document.createElement("main");
    var id = "";
    
    for (id in page.parent[page.name].main) createArticle(page, id, main);
    
    document.body.appendChild(main);
}

function createAside(page) // link to submenus
{
    var aside = document.createElement("aside");
    var ol = document.createElement(OL);
    var li;
    var a; // anchor
    
    var submenu = "";
    var subpage = {};
    
    for ([submenu, subpage] of Object.entries(page.parent[page.name].aside))
    {
        li = document.createElement(LI);
        a = document.createElement(A);
        
        a.href = page.name + "/" + submenu + HTML;
        if ("nav" in subpage) a.innerHTML = mergeLanguage(subpage.nav, page.language);
        else a.innerHTML = mergeLanguage(subpage.header.h1, page.language);
        
        li.appendChild(a);
        ol.appendChild(li);
    }
    
    aside.appendChild(ol);
    document.body.appendChild(aside);
}

function createAsideID(page) // link to bookmarks in the same page
{
    var aside = document.createElement("aside");
    var ol = document.createElement(OL);
    
    var articles = Object.keys(page.parent[page.name].main);
    var introduction = articles.shift(); // The first element must be INTRODUCTION.
    var article = "";
    var conclusion = articles.pop(); // The last element must be CONCLUSION.
    
    appendAsideEitherSide(introduction, page.language, ol);
    
    articles = shuffle(articles);
    for (article of articles) createAsideIDlist(article, mergeLanguage(page.parent[page.name].main[article].h2, page.language), ol);
    
    appendAsideEitherSide(conclusion, page.language, ol);
    
    aside.appendChild(ol);
    document.body.appendChild(aside);
}

function createAsideOthers(page) // link to other pages in the same folder
{
    var aside = document.createElement("aside");
    var ol = document.createElement(OL);
    var li;
    var a; // anchor
    
    var sibling = "";
    
    for (sibling of shuffle(Object.keys(page.parent)))
    {
        li = document.createElement(LI);
        a = document.createElement(A);
        
        if (page.name === sibling) // current page
        {
            a.style.color = "snow";
            li.style.backgroundColor = "goldenRod";
        }
        else a.href = sibling + HTML;
        
        a.innerHTML = mergeLanguage(page.parent[sibling].header.h1, page.language);
        
        li.appendChild(a);
        ol.appendChild(li);
    }
    
    aside.appendChild(ol);
    document.body.appendChild(aside);
}
////////////////////////
function createAsideCommon(page)
{
    var aside = document.createElement("aside");
    var button = [];
    var ol = [];
    var li;
    var a; // anchor
// tab
    button[0] = document.createElement("button");
    button[0].innerHTML = DICTIONARY.bookmark[page.language];
    aside.appendChild(button[0]);
    button[1] = document.createElement("button");
    button[1].innerHTML = DICTIONARY.sibling[page.language];
    aside.appendChild(button[1]);
    button[2] = document.createElement("button");
    button[2].innerHTML = DICTIONARY.submenu[page.language];
    aside.appendChild(button[2]);
// link to submenus
    ol[0] = document.createElement(OL);
    
    var submenu = "";
    var subpage = {};
    
    for ([submenu, subpage] of Object.entries(page.parent[page.name].aside))
    {
        li = document.createElement(LI);
        a = document.createElement(A);
        
        a.href = page.name + "/" + submenu + HTML;
        if ("nav" in subpage) a.innerHTML = mergeLanguage(subpage.nav, page.language);
        else a.innerHTML = mergeLanguage(subpage.header.h1, page.language);
        
        li.appendChild(a);
        ol[0].appendChild(li);
    }
    
    aside.appendChild(ol[0]);

// link to bookmarks in the same page
    ol[1] = document.createElement(OL);
    
    var articles = Object.keys(page.parent[page.name].main);
    var introduction = articles.shift(); // The first element must be INTRODUCTION.
    var article = "";
    var conclusion = articles.pop(); // The last element must be CONCLUSION.
    
    appendAsideEitherSide(introduction, page.language, ol[1]);
    
    articles = shuffle(articles);
    for (article of articles) createAsideIDlist(article, mergeLanguage(page.parent[page.name].main[article].h2, page.language), ol[1]);
    
    appendAsideEitherSide(conclusion, page.language, ol[1]);
    
    aside.appendChild(ol[1]);

// link to other pages in the same folder
    ol[2] = document.createElement(OL);
    var li;
    var a; // anchor
    
    var sibling = "";
    
    for (sibling of shuffle(Object.keys(page.parent)))
    {
        li = document.createElement(LI);
        a = document.createElement(A);
        
        if (page.name === sibling) // current page
        {
            a.style.color = "snow";
            li.style.backgroundColor = "goldenRod";
        }
        else a.href = sibling + HTML;
        
        a.innerHTML = mergeLanguage(page.parent[sibling].header.h1, page.language);
        
        li.appendChild(a);
        ol[2].appendChild(li);
    }
    
    aside.appendChild(ol[2]);
    document.body.appendChild(aside);
}
////////////////////////
function createFooter(page)
{
    var footer = document.createElement("footer");
    var small = document.createElement(SMALL);
    
    small.innerHTML = DICTIONARY.footer[page.language];
    
    footer.appendChild(small);
    document.body.appendChild(footer);
}
