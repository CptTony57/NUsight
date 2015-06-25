/**
 * @author: Monica Olejniczak
 */
Ext.define('NU.view.window.DashboardController', {
	extend: 'NU.view.window.DisplayController',
	alias: 'controller.Dashboard',
	requires: [
		'NU.util.TypeMap'
	],
	init: function () {
		this.grid = this.getView().lookupReference('dashboard');
		this.store = this.getViewModel().getStore('grid');
		this.robots = {};
		this.messages = [];
		this.addColumns(this.grid.headerCt);
		NU.Network.on('packet', this.onPacket, this);
		NU.Network.on('overview', this.onOverview, this);
	},

	/**
	 * Add the columns dynamically to the grid based off the message type enumeration.
	 *
	 * @param container The grid view header container.
	 */
	addColumns: function (container) {
		// Initialise an array of columns.
		var columns = [];
		// Iterate through every message type.
		Ext.Object.each(API.Message.Type, function (key, value) {
			// Capitalise the first letter and replace each underscore with a space.
			var text = key.substring(0, 1) + key.substring(1).toLowerCase().replace('_', ' ');
			// Lowercase the key.
			var dataIndex = key.toLowerCase();
			// Add the messages to the array.
			this.messages.push(dataIndex);
			// Add the number column to the array.
			columns.push(Ext.create('Ext.grid.column.Number', {
				text: text,
				dataIndex: dataIndex,
				format: '0'
			}));
		}, this);
		// Add the columns to the container.
		container.add(columns);
	},

	/**
	 * Retrieves the robot record from the grid store based of its IP address.
	 *
	 * @param robotIP The IP address of the robot.
	 * @returns {*}
	 */
	getRobot: function (robotIP) {
		// Get the robot from the object.
		var robot = this.robots[robotIP];
		// Check if the robot does not exist.
		if (!robot) {
			// Initialise the record with the robotIP.
			var record = {
				robotIP: robotIP
			};
			// Iterate through every message.
			for (var i = 0, len = this.messages.length; i < len; i++) {
				// Add the message to the record and initialise the value to 0.
				record[this.messages[i]] = 0;
			}
			// Add a mapping from the robot IP to the record so it can be updated later.
			robot = this.robots[robotIP] = this.store.add(record)[0];
		}
		return robot;
	},

	/**
	 * An event triggered when a packet is sent to the network.
	 *
	 * @param robotIP The IP address of the robot.
	 * @param type The type of the packet sent over the network.
	 * @param packet The packet information.
	 */
	onPacket: function (robotIP, type, packet) {
		// Obtain the robot and the key.
		var robot = this.getRobot(robotIP);
		var key = NU.Network.getTypeMap()[type];
		// Add the packet data to the column.
		robot.set(key, robot.get(key) + 1);
	},

	onOverview: function (robotIP, overview, timestamp) {
		// Get the robot from the robotIP and update the voltage and battery data.
		var robot = this.getRobot(robotIP);
		// Set the data obtained from the overview to update the view model for the selected robot.
		robot.set('behaviourState', this.parseBehaviourState(overview.getBehaviourState()));
		robot.set('voltage', overview.getVoltage());
		robot.set('battery', overview.getBattery() * 100);
	},

	parseBehaviourState: function (state) {
		return NU.TypeMap.get(API.Behaviour.State)[state];
	}

});
