/**
 * @author Monica Olejniczak
 */
Ext.define('NU.view.dashboard.panel.DashboardPanelViewModel', {
	extend: 'Ext.app.ViewModel',
	alias: 'viewmodel.DashboardPanel',
	requires: [
		'NU.util.TypeMap'
	],
	data: {
		name: '',
		battery: 0,
		// Localisation
		robotPosition: null,
		robotPositionCovariance: 0,
		robotHeading: 0,
		// Behaviour
		behaviourState: null,
		// Game controller
		gameMode: null,
		gamePhase: null,
		penaltyReason: null,
		// Hardware
		lastCameraImage: 0,
		// Vision
		lastSeenBall: 0,
		lastSeenGoal: 0
	},
	getUninitialised: function () {
		return 'NO DATA';
	},
	/**
	 * Retrieves the colour assicated with a value between 0 and 1.
	 *
	 * @param value The value being mapped to a color between 0 and 1.
	 * @returns {string}
	 */
	getColor: function (value) {
		var colors = this.getView().getColors();
		// Check if the value is a boolean.
		if (typeof value === 'boolean') {
			return value ? colors.OKAY : colors.DANGER;
		}
		// Returns the colour based on the value.
		return value < 0.5 ? colors.OKAY : value > 0.8 ? colors.DANGER : colors.WARNING;
	},
	/**
	 * Converts a value with a specified range to a new range between 0 and 1.
	 *
	 * @param min The min bound of the current value.
	 * @param max The max bound of the current value.
	 * @param value The value being converted.
	 * @returns {*}
	 */
	convertValue: function (min, max, value) {
		return ((value - min) / (max - min)) + min;
	},
	formulas: {
		batteryPercentage: function (get) {
			return get('battery') * 100;
		},
		position: function (get) {
			var robotPosition = get('robotPosition') || {x: 0, y: 0};
			return {
				x: robotPosition.x.toFixed(2),
				y: robotPosition.y.toFixed(2)
			};
		},
		positionBackground: function (get) {
			var position = get('position');
			var width = Field.constants.FIELD_WIDTH;
			var length = Field.constants.FIELD_LENGTH;
			return this.getColor(Math.abs(position.x) <= length * 0.5 && Math.abs(position.y) <= width * 0.5);
		},
		covariance: function (get) {
			return get('robotPositionCovariance') || {x: {x: 0, y: 0}, y: {x: 0, y: 0}};
		},
		heading: function (get) {
			var robotHeading = get('robotHeading') || {};
			return (Math.atan2(robotHeading.y, robotHeading.x) * 180 / Math.PI).toFixed(2);
		},
		state: function (get) {
			return NU.TypeMap.get(API.Behaviour.State)[get('behaviourState')] || this.getUninitialised();
		},
		mode: function (get) {
			return NU.TypeMap.get(API.GameState.Data.Mode)[get('gameMode')] || this.getUninitialised();
		},
		phase: function (get) {
			return NU.TypeMap.get(API.GameState.Data.Phase)[get('gamePhase')] || this.getUninitialised();
		},
		penalty: function (get) {
			return NU.TypeMap.get(API.GameState.Data.PenaltyReason)[get('penaltyReason')] || this.getUninitialised();
		},
		penaltyBackground: function (get) {
			var PenaltyReason = API.GameState.Data.PenaltyReason;
			var penaltyReason = get('penaltyReason');
			return this.getColor(penaltyReason === PenaltyReason.UNPENALISED);
		},
		cameraImage: function (get) {
			var lastCameraImage = get('lastCameraImage');
			return lastCameraImage ? new Date(lastCameraImage.getUtcTimestamp().toNumber()) : 'Not seen';
		},
		lastCameraBackground: function (get) {
			if (!get('lastCameraImage')) {
				return this.getColor(1);
			}
			return this.getColor(this.convertValue(0, 3, get('cameraImage')));
		},
		lastSeenBallElapsed: function (get) {
			var currentTime = Date.now();
			var lastSeenBall = get('lastSeenBall') || 0;
			if (lastSeenBall !== 0) {
				lastSeenBall = lastSeenBall.toNumber();
			}
			return ((currentTime - lastSeenBall) / 1000).toFixed(2);
		},
		lastBall: function (get) {
			var lastSeenBall = get('lastSeenBall');
			var elapsedTime = get('lastSeenBallElapsed');
			return lastSeenBall ? elapsedTime: 'Not seen';
		},
		lastBallBackground: function (get) {
			if (!get('lastSeenBall')) {
				return this.getColor(1);
			}
			return this.getColor(this.convertValue(0, 5, get('lastSeenBallElapsed')));
		},
		lastSeenGoalElapsed: function (get) {
			var currentTime = Date.now();
			var lastSeenGoal = get('lastSeenGoal') || 0;
			if (lastSeenGoal !== 0) {
				lastSeenGoal = lastSeenGoal.toNumber();
			}
			return ((currentTime - lastSeenGoal) / 1000).toFixed(2);
		},
		lastGoal: function (get) {
			var lastSeenGoal = get('lastSeenGoal');
			var elapsedTime = get('lastSeenGoalElapsed');
			return lastSeenGoal ? elapsedTime : 'Not seen';
		},
		lastGoalBackground: function (get) {
			if (!get('lastSeenGoal')) {
				return this.getColor(1);
			}
			return this.getColor(this.convertValue(0, 5, get('lastSeenGoalElapsed')));
		}
	}
});