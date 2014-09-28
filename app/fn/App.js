Ext.define('Ext.fn.App', {
    singleton: true,

    init: function(){
        // add native javascript function
        Ext.fn.Util.addNativeFunction();
        
        // create WebSocket container
        Ext.ws = {};

        // initialize QuickTips
        Ext.QuickTips.init();

        // initiating application data
        Ext.ComponentQuery.query('app-main')[0].getViewModel().setData(App.init);

        if (App.init.state == 1) { // if already loged in then
            Ext.fn.Util.afterLogin();
        }
    
        // disable browser context menu
        Ext.fn.Util.disableBrowserContextMenu();
                
        console.log('Application successfully initiated.');
    },

    mnAppOption: function(){
        Ext.widget('app-option');
    },

    mnChangePassword: function(){
        Ext.widget('change-password');
    },

    mnCustomReport: function(){
        var report = Ext.widget('custom-report');
        
        this.setLoading(true);
        report.getController().viewReport();
    },

    mnDashboard: function(){
        Ext.ComponentQuery.query('app-tab')[0].setActiveTab(0);
    },

    mnDeveloperInfo: function(){
        Ext.widget('developer-info');
    },

    mnListCredit: function(){
        var panel = this.newTab('list-credit');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListCustomer: function(){
        var panel = this.newTab('list-customer');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListDebit: function(){
        var panel = this.newTab('list-debit');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListProduct: function(){
        var panel = this.newTab('list-product');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListPurchase: function(){
        var panel = this.newTab('list-purchase');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListSales: function(){
        var panel = this.newTab('list-sales');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListStock: function(){
        var panel = this.newTab('list-stock');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListSupplier: function(){
        var panel = this.newTab('list-supplier');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListUnit: function(){
        var panel = this.newTab('list-unit');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnListUser: function(){
        var panel = this.newTab('list-user');
        if (!Ext.isEmpty(panel)) panel.getStore().search({});
    },

    mnLogout: function(){
        Mains.logout(function(result){
            if (result.success){
                var appTab = Ext.ComponentQuery.query('app-tab')[0],
                    tabItems = appTab.items.items,
                    tabLength = tabItems.length;

                appTab.setActiveTab(0);
                for(i=1;i<tabLength;i++){
                    tabItems[1].close();
                }

                Ext.ComponentQuery.query('app-main')[0].getViewModel().setData(result);

                Ext.fn.Util.afterLogout();

                setTimeout(function(){
                    Ext.ComponentQuery.query('login textfield[name=user]')[0].focus();
                }, 10);
            }else{
                console.log('Login error');
            }
        });
    },

    mnMonthlyReport: function(){
        var report = Ext.widget('monthly-report');
        
        this.setLoading(true);
        report.getController().viewReport();
    },
    
    mnUpdateBiodata: function(){
        Ext.widget('update-biodata');
    },

    newTab: function(alias, state){
        var main = Ext.main.ViewModel,
            tab = Ext.ComponentQuery.query('app-tab')[0],
            panel = Ext.ComponentQuery.query(alias)[0];

        state = (typeof(state) === 'undefined' ? 1 : state)
        if(
            (state == 0) 
            ||
            ( (state == 1) && (main.get('state') == 1) )
        ){
            if(!panel){
                var panel = tab.add({xtype:alias});
                panel.show();
            }
            tab.setActiveTab(panel);
            return panel;
        }else{
            Ext.Msg.alert('Akses ditolak', E0);
        }
    },

    notify: function(title, message, icon, manager){
        Ext.fn.Notification.show(title, message, icon, manager);
    },

    notification: function(title, message, icon, manager){
        Ext.fn.Notification.show(title, message, icon, manager);
    },

    printNotaCredit: function(id){
        window.open("remote/print/nota-credit.php?id=" + id, "_blank");
    },

    printNotaSales: function(id){
        window.open("remote/print/nota-sales.php?id=" + id, "_blank");
    },

    setLoading: function(bool){
        if (bool){
            Ext.WindowManager.each(function(window){
                Ext.main.Windows.push(window);
                window.hide();
            });
        }else{
            Ext.main.Windows.forEach(function(window){
                if (window.id){
                    var current;
                    if (current = Ext.getCmp(window.id)) current.show();
                }
            });
            Ext.main.Windows = [];
        }
        if (Ext.main.View) Ext.main.View.setLoading(bool);
    },
    
    showSecondPartyCredit: function(secondPartyId){
        Ext.fn.App.newTab('list-credit');
                
        POS.app.getStore('Credit').search({
            second_party_id: secondPartyId,
            credit_status: 'Belum Lunas'
        });        
    },
    
    showSecondPartyDebit: function(secondPartyId){
        Ext.fn.App.newTab('list-debit');
                
        POS.app.getStore('Debit').search({
            second_party_id: secondPartyId,
            credit_status: 'Belum Lunas'
        });        
    },
    
    showSecondPartySales: function(secondPartyId){
        Ext.fn.App.newTab('list-sales');
                
        POS.app.getStore('Sales').search({
            second_party_id: secondPartyId
        });
    },
    
    showProductPrice: function(productId){
        Ext.fn.App.newTab('list-stock');
                
        POS.app.getStore('Stock').search({
            product_id: productId
        });        
    },

    window: function(id){
        var window = Ext.getCmp(id);
        window ? window.show() : window = Ext.widget(id);
        return window;
    }
});