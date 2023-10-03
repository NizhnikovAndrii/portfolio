(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
                targetElement.hasAttribute("data-validate") ? formValidate.removeError(targetElement) : null;
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                targetElement.hasAttribute("data-validate") ? formValidate.validateInput(targetElement) : null;
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const inputOne = document.querySelector("#o_1");
    const imageSofaBlue = document.querySelector(".image-sofa__blue");
    const optionsImageBlue = document.querySelector(".options__image-blue");
    const inputTwo = document.querySelector("#o_2");
    const imageSofaGreen = document.querySelector(".image-sofa__green");
    const optionsImageGreen = document.querySelector(".options__image-green");
    const inputThree = document.querySelector("#o_3");
    const imageSofaOrange = document.querySelector(".image-sofa__orange");
    const optionsImageOrange = document.querySelector(".options__image-orange");
    const optionsLabels = document.querySelectorAll("label");
    let optionsLabelGreen = optionsLabels[1];
    let optionsLabelOrange = optionsLabels[2];
    inputOne.addEventListener("click", (() => {
        optionsImageBlue.classList.add("active");
        optionsImageGreen.classList.remove("active");
        optionsImageOrange.classList.remove("active");
        imageSofaBlue.classList.add("color-blue");
        imageSofaGreen.classList.remove("color-green");
        imageSofaOrange.classList.remove("color-orange");
    }));
    inputTwo.addEventListener("click", (() => {
        optionsImageBlue.classList.remove("active");
        optionsImageGreen.classList.add("active");
        optionsImageOrange.classList.remove("active");
        optionsLabelGreen.classList.add("label__green");
        imageSofaGreen.classList.add("color-green");
        imageSofaBlue.classList.remove("color-blue");
        imageSofaOrange.classList.remove("color-orange");
    }));
    inputThree.addEventListener("click", (() => {
        optionsImageBlue.classList.remove("active");
        optionsImageGreen.classList.remove("active");
        optionsImageOrange.classList.add("active");
        optionsLabelOrange.classList.add("label__orange");
        imageSofaGreen.classList.remove("color-green");
        imageSofaBlue.classList.remove("color-blue");
        imageSofaOrange.classList.add("color-orange");
    }));
    const inputBeige = document.querySelector("#card_1-beige");
    const inputOrange = document.querySelector("#card_1-orange");
    const inputPurp = document.querySelector("#card_1-purp");
    let imageArkelstropBeige = document.querySelector(".card__image-beige");
    let imageArkelstropOrange = document.querySelector(".card__image-orange");
    let imageArkelstropPurp = document.querySelector(".card__image-purp");
    inputBeige.addEventListener("click", (() => {
        imageArkelstropBeige.classList.add("active_card-1");
        imageArkelstropOrange.classList.remove("active_card-1");
        imageArkelstropPurp.classList.remove("active_card-1");
    }));
    inputOrange.addEventListener("click", (() => {
        imageArkelstropBeige.classList.remove("active_card-1");
        imageArkelstropOrange.classList.add("active_card-1");
        imageArkelstropPurp.classList.remove("active_card-1");
    }));
    inputPurp.addEventListener("click", (() => {
        imageArkelstropBeige.classList.remove("active_card-1");
        imageArkelstropOrange.classList.remove("active_card-1");
        imageArkelstropPurp.classList.add("active_card-1");
    }));
    const inputBeigeCard_2 = document.querySelector("#card_2-beige");
    const inputOrangeCard_2 = document.querySelector("#card_2-orange");
    let imageLillasenBeige = document.querySelector("#lillasen_1");
    let imageLillasenOrange = document.querySelector("#lillasen_2");
    inputBeigeCard_2.addEventListener("click", (() => {
        imageLillasenBeige.classList.add("active_card-2");
        imageLillasenOrange.classList.remove("active_card-2");
    }));
    inputOrangeCard_2.addEventListener("click", (() => {
        imageLillasenBeige.classList.remove("active_card-2");
        imageLillasenOrange.classList.add("active_card-2");
    }));
    const inputBrownCard_3 = document.querySelector("#card_3-brown");
    const inputGreyCard_3 = document.querySelector("#card_3-grey");
    let imageMickeBrown = document.querySelector("#micke_1");
    let imageMickeGrey = document.querySelector("#micke_2");
    inputBrownCard_3.addEventListener("click", (() => {
        imageMickeBrown.classList.add("active_card-3");
        imageMickeGrey.classList.remove("active_card-3");
    }));
    inputGreyCard_3.addEventListener("click", (() => {
        imageMickeBrown.classList.remove("active_card-3");
        imageMickeGrey.classList.add("active_card-3");
    }));
    const inputBrownCard_4 = document.querySelector("#card_4-brown");
    const inputGreyCard_4 = document.querySelector("#card_4-grey");
    const inputBeigeCard_4 = document.querySelector("#card_4-beige");
    let imageTilslagBrown = document.querySelector("#tilslag_3");
    let imageTilslagGrey = document.querySelector("#tilslag_2");
    let imageTilslagBeige = document.querySelector("#tilslag_1");
    inputBrownCard_4.addEventListener("click", (() => {
        imageTilslagBrown.classList.add("active_card-4");
        imageTilslagGrey.classList.remove("active_card-4");
        imageTilslagBeige.classList.remove("active_card-4");
    }));
    inputGreyCard_4.addEventListener("click", (() => {
        imageTilslagBrown.classList.remove("active_card-4");
        imageTilslagGrey.classList.add("active_card-4");
        imageTilslagBeige.classList.remove("active_card-4");
    }));
    inputBeigeCard_4.addEventListener("click", (() => {
        imageTilslagBrown.classList.remove("active_card-4");
        imageTilslagGrey.classList.remove("active_card-4");
        imageTilslagBeige.classList.add("active_card-4");
    }));
    const inputBrownCard_5 = document.querySelector("#card_5-brown");
    const inputGreyCard_5 = document.querySelector("#card_5-grey");
    const inputBeigeCard_5 = document.querySelector("#card_5-beige");
    let imageAdilsBrown = document.querySelector("#adils_1");
    let imageAdilsGrey = document.querySelector("#adils_3");
    let imageAdilsBeige = document.querySelector("#adils_2");
    inputBrownCard_5.addEventListener("click", (() => {
        imageAdilsBrown.classList.add("active_card-5");
        imageAdilsGrey.classList.remove("active_card-5");
        imageAdilsBeige.classList.remove("active_card-5");
    }));
    inputGreyCard_5.addEventListener("click", (() => {
        imageAdilsBrown.classList.remove("active_card-5");
        imageAdilsGrey.classList.add("active_card-5");
        imageAdilsBeige.classList.remove("active_card-5");
    }));
    inputBeigeCard_5.addEventListener("click", (() => {
        imageAdilsBrown.classList.remove("active_card-5");
        imageAdilsGrey.classList.remove("active_card-5");
        imageAdilsBeige.classList.add("active_card-5");
    }));
    const inputGreyCard_6 = document.querySelector("#card_6-grey");
    const inputBeigeCard_6 = document.querySelector("#card_6-beige");
    let imageLinmonGrey = document.querySelector("#linmon_1");
    let imageLinmonBeige = document.querySelector("#linmon_2");
    inputGreyCard_6.addEventListener("click", (() => {
        imageLinmonGrey.classList.add("active_card-6");
        imageLinmonBeige.classList.remove("active_card-6");
    }));
    inputBeigeCard_6.addEventListener("click", (() => {
        imageLinmonGrey.classList.remove("active_card-6");
        imageLinmonBeige.classList.add("active_card-6");
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
})();