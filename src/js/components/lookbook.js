import {stopScroll} from "@/js/helpers";

const selectors = {
    triggers: '[data-lookbook]',
    closeItem: '[data-lookbook-quickview-popup-close]',
    lookbookProductController: '[data-lookbook-controller]',
    inputVariantId: '[data-lookbook-input-id]'
}



const controllerHandle = (controller) => {
    const currentVariant = JSON.parse(controller.dataset.currentVariant);
    const productOptions = JSON.parse(controller.dataset.productOptions);
    const productVariants = JSON.parse(controller.dataset.productVariants);
    let selectedVariant = currentVariant;
    const selects = controller.querySelectorAll('select');

    const selectHandler = (e) => {
        //can be some issues if product have some special charters like ' " etc.
        const name = e.target.dataset.name;
        const selectedValue = e.target.value
        const selectedOption = productOptions.find(option => option.name === name)
        const allOptionValuesWithoutSelected = selectedOption.values.filter(value => value !== selectedValue)
        const inputId = controller.querySelector(selectors.inputVariantId);
        const addToCartButton = controller.querySelector('button');

        const targetOptions = [
            selectedValue,
            ... selectedVariant.options.filter(value => !allOptionValuesWithoutSelected.includes(value))
        ]

        productVariants.some(variant => {
            if (variant.options.every(option => targetOptions.includes(option))) {
                selectedVariant = variant;
                inputId.value = selectedVariant.id;

                return true
            }
        })

        if (!selectedVariant.available) {
            addToCartButton.classList.add('disabled');

            return;
        }

        addToCartButton.classList.remove('disabled')
    };


    if (selects.length > 0) {
        selects.forEach(select => {
            select.addEventListener('change', selectHandler)
        })
    }
};

const lookbookHandler = (lookbook) => {
    const id = lookbook.dataset.lookbook ?? null;

    if (id) {
        const item = document.getElementById(id);
        const controllers = item.querySelectorAll(selectors.lookbookProductController)
        const closeElems = item.querySelectorAll(selectors.closeItem);

        item.classList.add('visible');
        stopScroll.stop();

        closeElems.forEach(closeEl => {
            closeEl.addEventListener('click', () => {
                item.classList.remove('visible');
                stopScroll.scroll();
            })
        });

        if (controllers.length > 0) {
            controllers.forEach(controller => {
                controllerHandle(controller)
            })
        }
    }
};

export const initLookboks = () => {
    const lookbooks = document.querySelectorAll(selectors.triggers);

    if (lookbooks.length > 0) {
        lookbooks.forEach(lookbook => {
            lookbook.addEventListener('click', () => lookbookHandler(lookbook));
        })
    }
};