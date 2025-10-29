on(document, "DOMContentLoaded", () => {
    setTimeout(() => {
        const content = getElm("content");
        const edit_btn = getElm("edit-current-element");
        const delete_btn = getElm("delete-current-element");
        const hero_title = getQuery(".hero-title").get(0);
        const hero_subtitle = getQuery(".hero-subtitle").get(0);
        const hero_img = getQuery(".hero-img").get(0);
        const data = {
            metadata: {
                title: hero_title.html(),
                date: Date(),
                author: "Das ZMT-Team",
            },
            hero: {
                title: hero_title.html(),
                subtitle: hero_subtitle.html(),
                imageUrl: hero_img.alt,
                imageAlt: hero_img.src,
            },
            body: [],
        };
        const sortable = new Draggable.Sortable(content, {
            draggable: "#content > *:not(*[contenteditable='true'])",
        });
        let current_element = null;

        sortable.on("sortable:start", (e) => {
            const elements = getQuery("#content > *");
            current_element = e.data.dragEvent.data.originalSource;

            elements.forEach((element) => {
                element.classList.remove("active");
                element.innerHTML = markdownToHtml(element.innerHTML);
                element.contentEditable = false;
            });

            current_element.classList.add("active");
        });

        getElm("add-general").click(async () => {
            const title = await prompt("Bitte gib den Titel des Blogs ein.");
            const subtitle = await prompt("Bitte gib den Untertitel des Blogs ein, der unter dem Titel steht. Dieser Text wird ausserdem als kleine Vorschau auf der Startseite angezeigt.");
            const author = await prompt("Bitte gib den Autor des Blogs ein.");

            if (!title || !subtitle || !author || title === "" || subtitle === "" || author === "") return alert("Bitte fülle alle Felder aus.");

            hero_title.innerHTML = title.trim();
            hero_subtitle.innerHTML = subtitle;
            data.hero.title = title.trim();
            data.hero.subtitle = subtitle;
            data.metadata.author = author.trim();

            const result = await confirm("Möchtest du ein Bild für den Blog hinzufügen? Falls ja, wird der Bildschirm gelb. Du musst dann auf den Bildschirm klicken, um ein Bild hochzuladen.");

            if (!result) return;

            const input = createElm("input");
            const div = createElm("div");

            div.addClass("upload-hero-img-field");
            input.addClass("upload-hero-img");

            input.type = "file";
            input.accept = "image/*";
            input.on("change", async (e) => {
                const base64 = await input.getImgBase64();

                hero_img.src = base64;
                hero_img.alt = input.file().name;
                data.hero.imageUrl = base64;
                data.hero.imageAlt = input.file().name;

                div.remove();
            });

            div.append(input);
            getQuery("body").get(0).append(div);
        });

        getElm("add-text").click(async () => {
            const element = createElm("p");
            element.addClass("blog_text");
            element.innerHTML = await prompt("Bitte gib den Text ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");

            content.prepend(element);
        });

        getElm("add-title").click(async () => {
            const element = createElm("h1");
            element.addClass("blog_title");
            element.innerHTML = await prompt("Bitte gib den Titel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");

            content.prepend(element);
        });

        getElm("add-subtitle").click(async () => {
            const element = createElm("h2");
            element.addClass("blog_subtitle");
            element.innerHTML = await prompt("Bitte gib den Untertitel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");

            content.prepend(element);
        });

        getElm("add-picture").click(() => addImg("img-only"));

        getElm("add-picture-text").click(() => addImg("left"));

        getElm("add-text-picture").click(() => addImg("right"));

        getElm("add-line").click(() => {
            const div = createElm("div");
            div.addClass("blog_line");

            content.prepend(div);
        });

        getElm("add-multiple-pictures").click(() => {
            const input = createElm("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.on("change", async (e) => {
                const fileArray = [];

                for (let i = 0; i < input.files.length; i++) {
                    const file = input.files[i];

                    fileArray.push({
                        base64: await toBase64(file),
                        name: file.name,
                        id: `auto_${randomString(37)}`,
                    });
                }

                const wrapper = createElm("div");
                const wrapperId = `auto_${randomString(32)}`;
                wrapper.addClass("blog_carousel", wrapperId);

                const mainDiv = createElm("div");
                const mainDivId = `auto_${randomString(33)}`;
                mainDiv.addClass("blog_c-main", mainDivId);

                const nextBtn = createElm("button");
                const nextBtnId = `auto_${randomString(34)}`;
                nextBtn.type = "button";
                nextBtn.id = nextBtnId;
                nextBtn.addClass("blog_carousel_next");

                const prevBtn = createElm("button");
                const prevBtnId = `auto_${randomString(35)}`;
                prevBtn.type = "button";
                prevBtn.id = prevBtnId;
                prevBtn.addClass("blog_carousel_prev");

                const ruler = createElm("div");
                const rulerId = `auto_${randomString(36)}`;
                ruler.addClass("blog_c-ruler", rulerId);

                for (let i = 0; i < fileArray.length; i++) {
                    const file = fileArray[i];

                    const img = createElm("img");
                    const preview = createElm("img");
                    img.alt = file.name;
                    preview.alt = file.name;
                    img.src = file.base64;
                    preview.src = file.base64;
                    img.addClass(file.id);
                    preview.addClass(file.id);

                    mainDiv.append(img);
                    ruler.append(preview);
                }

                const script = createElm("script");
                script.type = "text/javascript";

                const imgArrayName = `imgArray_${randomString(16)}`;
                const currentImgName = `currentImg_${randomString(16)}`;
                const funcNextName = `next_${randomString(16)}`;
                const funcPrevName = `prev_${randomString(16)}`;
                const funcToName = `to_${randomString(16)}`;

                let scriptContent = `const ${imgArrayName} = [`;

                for (let i = 0; i < fileArray.length; i++) {
                    scriptContent += `getQuery(".${fileArray[i].id}"),`;
                }

                scriptContent += `];
        let ${currentImgName} = 1;
        ${imgArrayName}[${currentImgName} - 1].toggleClass("active");
        function ${funcNextName}() {
            ${currentImgName} + 1 > ${imgArrayName}.length ?
            ${currentImgName} = 1 :
            ${currentImgName}++;
            ${currentImgName} === 1 ?
            ${imgArrayName}[${imgArrayName}.length - 1].toggleClass("active") :
            ${imgArrayName}[${currentImgName} - 2].toggleClass("active");
            ${imgArrayName}[${currentImgName} - 1].toggleClass("active");
        }
        function ${funcPrevName}() {
            ${currentImgName} - 1 === 0 ?
            ${currentImgName} = ${imgArrayName}.length :
            ${currentImgName}--;
            ${currentImgName} === ${imgArrayName}.length ?
            ${imgArrayName}[0].toggleClass("active") :
            ${imgArrayName}[${currentImgName}].toggleClass("active");
            ${imgArrayName}[${currentImgName} - 1].toggleClass("active");
        }
        function ${funcToName}(i) {
            ${imgArrayName}[${currentImgName} - 1].toggleClass("active");
            ${imgArrayName}[i - 1].toggleClass("active");
            ${currentImgName} = i;
        }
        getElm("${nextBtnId}").click(${funcNextName});
        getElm("${prevBtnId}").click(${funcPrevName});
        for (let i = 0; i < ${imgArrayName}.length; i++) {
            ${imgArrayName}[i].get(1).click(() => ${funcToName}(i + 1));
        };`;

                script.innerHTML = scriptContent;

                wrapper.append(mainDiv, nextBtn, prevBtn, ruler, script);
                content.prepend(wrapper);
            });

            input.click();
        });

        getElm("add-team").click(async () => {
            const wrapper = createElm("div");

            const response = await fetch("/chunks/team/getCurrentTeam", {
                method: "GET",
            });

            const textContent = await response.text();

            wrapper.innerHTML = textContent;

            wrapper.addClass("blog_team");

            content.append(wrapper);
        });

        getElm("done").click(async () => {
            const result = await confirm("Bist du sicher, dass alles fertig ist? Wenn du auf OK klickst, wird der Blog hochgeladen. Das kann aber etwas dauern, deshalb musst du unbedingt warten bis die Bestätigung kommt.");

            if (!result) return;

            getElm("done").disabled = true;

            data.metadata.date = Date();

            const main = getQuery("main").get(0);

            const hero = main.getQuery(".hero").get(0);

            const heroTitle = hero.getQuery(".hero-title").get(0);

            data.metadata.title = heroTitle.text();
            data.hero.title = heroTitle.text();

            const heroSubtitle = hero.getQuery(".hero-subtitle").get(0);

            data.hero.subtitle = heroSubtitle.text();

            const heroImage = hero.getQuery(".hero-img").get(0);

            data.hero.imageUrl = heroImage.src;
            data.hero.imageAlt = heroImage.alt;

            const content = main.getQuery("#content > *");

            content.forEach((element) => {
                if (element.hasClass("blog_title")) {
                    data.body.push({
                        type: "title",
                        data: {
                            text: element.innerHTML,
                        },
                    });
                } else if (element.hasClass("blog_subtitle")) {
                    data.body.push({
                        type: "subtitle",
                        data: {
                            text: element.innerHTML,
                        },
                    });
                } else if (element.hasClass("blog_text")) {
                    data.body.push({
                        type: "paragraph",
                        data: {
                            text: element.innerHTML,
                        },
                    });
                } else if (element.hasClass("blog_img")) {
                    data.body.push({
                        type: "image",
                        data: {
                            imageUrl: element.src,
                            imageAlt: element.alt,
                        },
                    });
                } else if (element.hasClass("blog_half")) {
                    const imagePosition = element.hasClass("left") ? "left" : "right";

                    const img = element.getQuery("img").get(0);
                    const p = element.getQuery("p").get(0);

                    data.body.push({
                        type: "image-paragraph",
                        data: {
                            imagePosition,
                            text: p.innerHTML,
                            imageUrl: img.src,
                            imageAlt: img.alt,
                        },
                    });
                } else if (element.hasClass("blog_line")) {
                    data.body.push({
                        type: "line",
                        data: null,
                    });
                } else if (element.hasClass("blog_carousel")) {
                    const imageElementArray = element.getQuery(".blog_c-main > img");

                    const storage = {
                        type: "multiple-images",
                        data: {
                            imageUrlArray: [],
                            imageAltArray: [],
                        },
                    };

                    imageElementArray.forEach((image) => {
                        storage.data.imageUrlArray.push(image.src);
                        storage.data.imageAltArray.push(image.alt);
                    });

                    data.body.push(storage);
                } else if (element.hasClass("blog_team")) {
                    const ul = element.getQuery("ul.team-member").get(0);

                    if (typeof ul === "undefined") {
                        console.error("No element found.");
                        return;
                    }

                    const id = ul.data("data-team-id");

                    data.body.push({
                        type: "team",
                        data: {
                            teamId: isNaN(Number(id)) ? 0 : Number(id),
                        },
                    });
                } else {
                    console.warn("Unknown element");
                    alert("Irgendwas ist kaputt gegangen. Überprüfe den Blog nach dem Hochladen noch einmal und melde dich eventuell beim Administrator. (Ein Element wurde nicht erkannt und konnte nicht mitgespeichert werden. Alles andere hat soweit geklappt.)");
                }
            });

            const url = edit_btn.data("data-blog-is-new") === "true" ? "/post/blog" : "/post/blog/update";

            const response = await post(url, {
                json: data,
                originalName: edit_btn.data("data-blog-original-name"),
            });

            if (response.ok) return alert("Das hat geklappt, der Blog ist jetzt online und du kannst den Builder verlassen.");

            getElm("done").disabled = false;

            alert("Etwas hat nicht geklappt. Schliesse den Builder nicht und versuche es in einigen Sekunden erneut. Wenn das Problem länger besteht, melde dich bitte beim Entwickler.");
        });

        edit_btn.click(async () => {
            switch (current_element.tagName) {
                case "P":
                    current_element.contentEditable = true;
                    current_element.innerText = HTMLToMarkdown(current_element.innerHTML);
                    break;
                case "H1":
                    current_element.innerHTML = await prompt("Bearbeite den Text wie nötig.", HTMLToMarkdown(current_element.innerHTML));
                    break;
                case "H2":
                    current_element.innerHTML = await prompt("Bearbeite den Text wie nötig.", HTMLToMarkdown(current_element.innerHTML));
                    break;
                case "IMG":
                    handleImgEdit(current_element);
                    break;
                case "DIV":
                    handleEdit(current_element);
                    break;
                default:
                    console.log(current_element.tagName);
                    alert("Dieses Element kann nicht bearbeitet werden.");
                    break;
            }
        });

        delete_btn.click(async () => {
            const result = await confirm("Möchtest du dieses Element wirklich löschen?");
            if (result) current_element.remove();
        });

        on(document, "keydown", (e) => {
            if (e.key === "Delete") {
                delete_btn.click();
            }
        });

        function elmToJson(element) {
            const options = {
                tagName: element.tagName,
                attributes: {},
                children: [],
            };

            for (let attr of element.attributes) {
                options.attributes[attr.name] = attr.value;
            }

            for (let child of element.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    const content = child.textContent.trim();

                    if (content === "") continue;

                    options.children.push({
                        tagName: "___text___",
                        content,
                    });

                    continue;
                }

                options.children.push(elmToJson(child));
            }

            return options;
        }

        function jsonToElm(options) {
            const element = document.createElement(options.tagName);

            for (let attr in options.attributes) {
                element.setAttribute(attr, options.attributes[attr]);
            }

            for (let child of options.children) {
                if (child.tagName === "___text___") {
                    element.appendChild(document.createTextNode(child.content));
                    continue;
                }

                element.appendChild(jsonToElm(child));
            }

            return element;
        }

        function handleEdit(element) {
            if (element.classList.contains("blog_half")) {
                element.contentEditable = true; // Needs to be true to not select the dragged base element again on click in the inner p tag
                element.querySelector("p").contentEditable = true;
            } else if (element.classList.contains("blog_line")) {
                alert("Du kannst einen Strich nicht bearbeiten ;)");
            } else {
                alert("Du kannst ein Carousel nicht bearbeiten, bitte lösche das falsche und füge ein neues ein.");
            }
        }

        function handleImgEdit(element) {
            const input = createElm("input");
            input.type = "file";
            input.accept = "image/*";
            input.on("change", async (e) => {
                const base64 = await input.getImgBase64();

                element.src = base64;
                element.alt = input.file().name;
            });

            input.click();
        }

        function markdownToHtml(text) {
            return text
                .replace(/\*\*\*([^\*]{1,})\*\*\*/gm, "<b>$1</b>")
                .replace(/\_\_\_([^\_]{1,})\_\_\_/gm, "<i>$1</i>")
                .replace(/\+\+\+([^\+]{1,})\+\+\+/gm, "<u>$1</u>")
                .replace(/\{\[([^\]]+)\]\(([^)]+)\)\}/gm, "<a href='$2' target='_blank'>$1</a>")
                .replace(/\n/gm, "<br>"); // Does not need a div inserters
        }

        function HTMLToMarkdown(text) {
            return text
                .replace(/<b>((?:(?!<\/b>).)+)<\/b>/gm, "***$1***")
                .replace(/<i>((?:(?!<\/b>).)+)<\/i>/gm, "___$1___")
                .replace(/<u>((?:(?!<\/b>).)+)<\/u>/gm, "+++$1+++")
                .replace(/<a href='([^']*)' target='_blank'>(.*?)<\/a>/gm, "{[$2]($1)}")
                .replace(/<div>(.*?)<\/div>/gm, "$1")
                .replace(/<br>/gm, "\n");
        }

        async function addImg(type) {
            const input = createElm("input");
            input.type = "file";
            input.accept = "image/*";
            input.on("change", async (e) => {
                const base64 = await input.getImgBase64();

                const element = createElm("img");
                element.src = base64;
                element.alt = input.file().name;
                if (type === "img-only") {
                    element.addClass("blog_img");
                    content.prepend(element);
                } else {
                    const div = createElm("div");
                    div.addClass("blog_half");
                    console.log(type)
                    div.addClass(type);

                    const text = createElm("p");
                    text.innerHTML = await prompt("Bitte gib den Text ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");

                    div.append(type === "left" ? element : text);
                    div.append(type === "left" ? text : element);
                    content.prepend(div);
                }
            });

            input.click();
        }
    }, 500);
});
