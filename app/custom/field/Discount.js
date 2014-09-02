Ext.define('POS.custom.field.Discount', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.field-discount',

    fieldStyle: 'text-align: right;',
    maxValue: 100,
    minValue: 0,
    step: 5,
    value: 0
});