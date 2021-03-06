import IMask from 'imask';
import { getQueryString, setFormValues } from './utils';

document.querySelectorAll('#schedule-payment').forEach(page => {

    const form = page.querySelector("form");
    const number = page.querySelector("#number");
    const name = page.querySelector("#name");
    const expiry = page.querySelector("#expiry");
    const inputCvv = page.querySelector("#cvv");
    const creditcard = page.querySelector("#credit-card");
    const svgCvv = page.querySelector('svg .cvv');
    const svgName = page.querySelector('svg .name');
    const svgNumber1 = page.querySelector('svg .number-1');
    const svgNumber2 = page.querySelector('svg .number-2');
    const svgNumber3 = page.querySelector('svg .number-3');
    const svgNumber4 = page.querySelector('svg .number-4');
    const svgExpiry = page.querySelector('svg .expiry');

    setFormValues(form, getQueryString());

    name.addEventListener('keyup', e => {
        svgName.innerHTML = name.value.toUpperCase();
    });

    number.addEventListener("keyup", e => {
        const numberString = number.value.replaceAll(' ', '').substr(0, 4);

        svgNumber1.innerHTML = numberString.substr(0, 4);
        svgNumber2.innerHTML = numberString.substr(4, 4);
        svgNumber3.innerHTML = numberString.substr(8, 4);
        svgNumber4.innerHTML = numberString.substr(12, 4);
    });

    expiry.addEventListener("keyup", e => {
        svgExpiry.innerHTML = expiry.value;
    })

    inputCvv.addEventListener('keyup', e => {
        svgCvv.innerHTML = inputCvv.value;
    });

    creditcard.addEventListener('click', e => {
        creditcard.classList.toggle('flipped');
    });

    inputCvv.addEventListener('focus', () => creditcard.classList.add('flipped'))
    inputCvv.addEventListener('blur', () => creditcard.classList.remove('flipped'))

    new IMask(number, {
        mask: '0000 0000 0000 0000'
    });

    new IMask(expiry, {
        mask: '00/00'
    });

    new IMask(inputCvv, {
        mask: '000[0]'
    });

    page.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', e => {
            page.classList.add('keyboard-open');
        });

        input.addEventListener('blur', e => {
            page.classList.remove('keyboard-open');
        });
    })
});