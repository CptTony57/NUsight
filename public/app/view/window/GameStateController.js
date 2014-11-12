Ext.define('NU.view.window.GameStateController', {
	extend: 'NU.view.window.DisplayController',
	alias: 'controller.GameState',
	init: function () {
		var view = this.getView();
		view.mon(NU.util.Network, 'game_state', this.onGameState, this);
	},
	onSelectRobot: function (robotIP) {
		var store = this.lookupReference('gameStates').getStore();
		store.clearFilter(true);
		store.addFilter({
			property: 'robotIP', value: robotIP
		});
		this.callParent(arguments);
	},
	onClearStateLog: function () {
		var store = this.lookupReference('gameStates').getStore();
		store.remove(store.query('robotIP', this.getRobotIP()).items);
	},
	onGameState: function (robotIP, gameState, timestamp) {
		// TODO: remove
		if (robotIP !== this.robotIP) {
			return;
		}

		var store = this.getGameStatesStore();
		store.add({
			time: timestamp,
			robotIP: robotIP,
			eventName: gameState.getEvent(),
			state: gameState.getData()
		});
	}
});
