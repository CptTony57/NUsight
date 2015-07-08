/**
 * @author: Monica Olejniczak
 */
Ext.define('NU.view.network.reactions.grid.Grid', {
	extend: 'Ext.grid.Panel',
	alias: 'widget.nu_network_reactions_grid',
	requires: [
		'Ext.grid.column.CheckColumn',
		'NU.view.network.reactions.grid.GridController',
		'NU.view.network.reactions.grid.GridViewModel'
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	columnWidth: 0.325,
	config: {
		robot: null
	},
	viewModel: {
		type: 'NetworkReactionsGrid'
	},
	controller: 'NetworkReactionsGrid',
	bind: {
		title: '{name}',
		store: '{grid}'
	},
	listeners: {
		update: 'onUpdate'
	},
	hideHeaders: true,
	columns: [{
		text: 'Type',
		dataIndex: 'name',
		flex: 1
	}, {
		text: 'Packets',
		dataIndex: 'packets',
		width: 50
	}, {
		xtype: 'checkcolumn',
		text: 'Enabled',
		dataIndex: 'enabled',
		width: 30,
		listeners: {
			checkChange: 'onCheckChange'
		}
	}]
});
