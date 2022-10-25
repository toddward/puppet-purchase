let selectors = new Map();

// Validated
selectors.set('singin_selector_1', 'button[type=submit]'); //used 
selectors.set('email_selector', 'input[name=username]'); // used
selectors.set('pass_selector', 'input[name=password]'); // used
selectors.set('outOfStock_selector', 'div.error-message'); // used
selectors.set('pickUp_bttn_selector', 'div.relatedProducts__bundle__items > div > div:nth-child(1)');
selectors.set('chekout_bttn_selector_1', 'button[id=addToCart]');

// Unvalidated
selectors.set('securityCode_selector', 'div:nth-child(2) > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td');
selectors.set('delete_email_selector', 'div > div.iH.bzn > div > div:nth-child(2) > div.T-I.J-J5-Ji.nX.T-I-ax7.T-I-Js-Gs.mA > div');
selectors.set('securityCode_input_selector', 'div.form-v-code input');
selectors.set('inbox_selector', 'html body div div div div div div div div div div div div div div div div div div div table tbody tr');
selectors.set('inbox_singin_selector', 'button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.qIypjc.TrZEUc');
selectors.set('inbox_email_selector', 'input#identifierId.whsOnd.zHQkBf');
selectors.set('inbox_password_selector', 'input.whsOnd.zHQkBf');

selectors.set('password_selector', 'input#password.sc-iwsKbI.eAChmV.sc-kIPQKe.frLPpE');

selectors.set('checkout_bttns', 'button.btn.btn-primary.checkout-step-action-done.layout-quarter');
selectors.set('cvv_bttn_selector', 'input.form-text.mask-cvv-4');
selectors.set('placeOrder_selector', 'button#btnCreditCard.btn.btn-primary.btn-wide');

module.exports = {
    selectors,
}