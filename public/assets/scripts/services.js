import { format } from 'date-fns';
import firebase from './firebase-app';
import { appendTemplate, formatCurrency, getFormValues, getQueryString, getQueryStringFromJSON, onSnapshotError, setFormValues } from './utils';

let serviceSummary = [];

const renderServiceOptions = (context, serviceOptions) => {
    const optionsEl = context.querySelector('.options');

    optionsEl.innerHTML = '';

    serviceOptions.forEach(item =>  {
        const label = appendTemplate(optionsEl, "label", 
        `
            <input type="checkbox" name="service" value="${item.id}" />
            <div class="square">
                <div></div>
            </div>
            <div class="content">
                <span class="name">${item.name}</span>
                <span class="description">${item.description}</span>
                <span class="price">${formatCurrency(item.price)}</span>
            </div>
        `);

        label.querySelector('[type=checkbox]').addEventListener('change', e => {
            const { value, checked } = e.target;

            if (checked) {
                const service = serviceOptions.filter((item) => {
                    return (Number(item.id) === Number(value)); 
                    // return +item.id === +value); 
                })[0];
                serviceSummary.push(service.id);
            } else {
                serviceSummary = serviceSummary.filter(id => {
                    return Number(id) !== Number(value)
                });
            }

            renderServiceSummary(context, serviceOptions);
        });
    });
};

const renderServiceSummary = (context, serviceOptions) => {
    const tbodyEl = context.querySelector("aside tbody");
    
    tbodyEl.innerHTML = '';

    serviceSummary
    .map(id => serviceOptions
    .filter(item => Number(item.id) === Number(id))[0])
    .sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else { 
            return 0;
        }
    })
    .forEach(item => {
        appendTemplate(tbodyEl, "tr", 
        `   <td>${item.name}</td>
            <td class="price">${formatCurrency(item.price)}</td>
        `)
    });

    const totalEl = context.querySelector('footer .total');

    const result = serviceSummary.map(id => {
        return serviceOptions.filter(item => {
            return Number(item.id) === Number(id);
        })[0];
    })

    const total = result.reduce((totalResult, item) => {
        return Number(totalResult) + Number(item.price);
    }, 0);

    totalEl.innerHTML = formatCurrency(total);
}

document.querySelectorAll("#schedules-services").forEach(page => {
    const db = firebase.firestore();

    db.collection("services").onSnapshot(snapshot => {

        const services = [];

        snapshot.forEach(item => {
            services.push(item.data());
        });

        renderServiceOptions(page, services);
    }, onSnapshotError);

    const params = getQueryString();

    const form = page.querySelector('form');

    setFormValues(form, params);

    page.querySelector("#btn-summary-toggle")
    .addEventListener('click', () => page.querySelector('aside').classList.toggle('open'));

    form.addEventListener('submit', e =>{
        e.preventDefault();

        const values = getFormValues(form);

        window.location.href = `/schedules-payment.html?${getQueryStringFromJSON(values)}`;
    })
});