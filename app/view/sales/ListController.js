Ext.define('POS.view.sales.ListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.list-sales',

    control: {
        '#': {
            boxready: function(panel){
                var add = this.lookupReference('add');
                setTimeout(function(){
                    add.focus();
                }, 10);
            },
            selectionchange: function(sm, selected){
                var btnDetail = this.lookupReference('detail'),
                    btnEdit = this.lookupReference('edit'),
                    btnDelete = this.lookupReference('cancel'),
                    btnPrint = this.lookupReference('print');

                btnDetail.setDisabled(selected.length !== 1);
                btnEdit.setDisabled(selected.length !== 1);
                btnDelete.setDisabled(selected.length === 0);
                btnPrint.setDisabled(selected.length !== 1);
            },
            celldblclick: 'detail',
            itemcontextmenu: 'showMenu'
        }
    },
    
    add: function(){
        Ext.fn.App.window('add-sales');
    },

    detail: function(){
        var rec     = this.getView().getSelectionModel().getSelection()[0],
            params  = {
                id: rec.get('id')
            };

        var detail = Ext.fn.App.window('detail-sales');
        detail.getController().load(params);
    },

    edit: function(){
        var rec     = this.getView().getSelectionModel().getSelection()[0],
            params  = {
                id: rec.get('id')
            };

        var edit = Ext.fn.App.window('edit-sales');
        edit.getController().load(params);
    },

    print: function(){
        var rec  = this.getView().getSelectionModel().getSelection()[0];

        Ext.fn.App.printNotaSales(rec.get('id'));
    },
    
    cancel: function(){
        var sm      = this.getView().getSelectionModel(),
            sel     = sm.getSelection(),
            smCount = sm.getCount();

        Ext.Msg.confirm(
            '<i class="fa fa-exclamation-triangle glyph"></i> Batalkan Penjualan ',
            '<p><b>Apakah Anda yakin akan membatalkan penjualan (<span style="color:red">' + smCount + ' data</span>)?</b>',
            function(btn){
                if (btn == 'yes'){
                    var id = [];
                    for(i=0;i<smCount;i++){
                        id.push(sel[i].get('id'));
                    }

                    Ext.fn.App.setLoading(true);
                    var monitor = Ext.fn.WebSocket.monitor(
                        Ext.ws.Main.on('sales/cancel', function(websocket, result){
                            clearTimeout(monitor);
                            Ext.fn.App.setLoading(false);
                            if (result.success){
                                POS.app.getStore('Sales').load();
                            }else{
                                Ext.fn.App.notification('Ups', result.errmsg);
                            }
                        }, this, {
                            single: true,
                            destroyable: true
                        })
                    );
                    Ext.ws.Main.send('sales/cancel', {id: id});
                }
            }
        );
    },
    
    search: function(){
        Ext.fn.App.window('search-sales');
    },
    
    showMenu: function(view, record, item, index, e, eOpts) {
        var me = this;
        
        e.stopEvent();
        if (!me.menu) {
            me.menu = new Ext.menu.Menu({
                plain: true,
                items : [{
                    text: '<i class="fa fa-credit-card main-nav-icon"></i> Detail Penjualan',
                    handler: function(){
                        me.detail();
                    }
                },{
                    text: '<i class="fa fa-edit main-nav-icon"></i> Ubah Data Penjualan',
                    handler: function(){
                        me.edit();
                    }
                },{
                    text: '<i class="fa fa-undo main-nav-icon"></i> Batalkan Penjualan',
                    handler: function(){
                        me.cancel();
                    }
                },{
                    text: '<i class="fa fa-print main-nav-icon"></i> Print',
                    handler: function(){
                        me.print();
                    }
                }]
            });
        }
        me.menu.showAt(e.getXY());
    },
    
    reset: function(){
        this.getView().getStore().search({});
    }
});
