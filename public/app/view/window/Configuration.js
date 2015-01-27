/**
 * @author: Monica Olejniczak
 */
Ext.define('NU.view.window.Configuration', {
    extend : 'NU.view.window.Display',
    requires: [
        'NU.store.ConfigurationTree',
        'Ext.grid.column.Widget',
        'NU.view.column.Widget',
        'NU.view.factory.Widget',
        'NU.view.window.ConfigurationController'
    ],
    alias: 'widget.nu_configuration_window',
    controller: 'Configuration',
    title: 'Configuration',
    width: 1000,
    height: 550,
    tbar: [{
        xtype: 'robot_selector',
        listeners: {
            selectRobot: 'onSelectRobot'
        }
    }, {
        xtype: 'component',
        reference: 'currentMode',
        tpl: '<strong>Current mode: </strong> {name}',
        flex: 2,
        listeners: {
            afterRender: 'onCurrentModeAfterRender'
        }
    }, {
        xtype: 'button',
        reference: 'save',
        text: 'Save',
        handler: 'onSave',
        listeners: {
            afterRender: 'onSaveAfterRender'
        }
    }, {
        xtype: 'button',
        reference: 'switchMode',
        tpl: 'Switch to {name}',
        listeners: {
            afterRender: 'onSwitchModeAfterRender'
        }
    }],
    items: [{
        xtype: 'treepanel',
        reference: 'configurations',
        referenceHolder: true,
        title: 'Robot Configurations',
        store: Ext.create('NU.store.ConfigurationTree'),
        autoLoad: true,
        rootVisible: false,
        rowLines: true,
        columnLines: true,
        viewConfig: {
            stripeRows: true
        },
        columns: [{
            xtype: 'treecolumn',
            text: 'Path',
            dataIndex: 'name',
            sortable: false,
            flex: 1
        }, {
            xtype: 'widgetColumn',
            text: 'Configurations',
            widget: {
                xtype: 'factoryWidget'
            },
            sortable: false,
            listeners: {
                updateWidget: 'onUpdateWidget'
            },
            flex: 1
        }]
    }]
});
