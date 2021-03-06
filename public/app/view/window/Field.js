Ext.define('NU.view.window.Field', {
	extend: 'NU.view.window.Display',
	alias: 'widget.nu_field_window',
	requires: [
		'NU.view.window.FieldController',
		'NU.view.field.Robot',
		'NU.view.robot.Selector',
		'Ext.form.field.Checkbox'
	],
	controller: 'Field',
	title: 'Localisation Display',
	width: 800,
	height: 400,
	layout: 'fit',
	listeners: {
		afterrender: 'onAfterRender'
	},
	tbar: {
		xtype: 'toolbar',
		layout: {
			overflowHandler: 'Menu'
		},
		items: [{
			xtype: 'robot_selector',
			listeners: {
				selectRobot: 'onSelectRobot'
			}
		}, {
			text: 'HawkEye',
			listeners: {
				click: 'onHawkEye'
			}
		}, {
			text: 'Close Front',
			listeners: {
				click: 'onCloseFront'
			}
		}, {
			text: 'Close Angle',
			listeners: {
				click: 'onCloseAngle'
			}
		}, {
			text: 'Close Side',
			listeners: {
				click: 'onCloseSide'
			}
		}, '->', {
			text: 'Extra',
			menu: {
				items: [{
					xtype: 'checkbox',
					fieldLabel: 'Orientation',
					checked: true,
					listeners: {
						change: 'onDisplayOrientation'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Odometry',
					checked: false,
					listeners: {
						change: 'onDisplayOdometry'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Localisation',
					checked: false,
					listeners: {
						change: 'onDisplayLocalisation'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Anaglyph',
					checked: false,
					listeners: {
						change: 'onAnaglyph'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Gamepad',
					checked: false,
					listeners: {
						change: 'onGamepad'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Inverted',
					checked: true,
					listeners: {
						change: 'onInverted'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Crosshair',
					checked: true,
					listeners: {
						change: 'onDisplayCrosshair'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Orthographic',
					checked: false,
					listeners: {
						change: 'onOrthographic'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Robot Grid',
					checked: false,
					listeners: {
						change: 'onRobotGrid'
					}
				}, {
					xtype: 'checkbox',
					fieldLabel: 'Skybox',
					checked: true,
					listeners: {
						change: 'onSkybox'
					}
				}]
			}
		}]
	},
	bbar: [{
		xtype: 'component',
		reference: 'coordinates',
		height: 15,
		tpl: 'X: {x}, Y: {y}, Z: {z}',
		data: {
			x: 0,
			y: 0,
			z: 0
		}
	}],
	items: [{
		xtype: 'threejs',
		reference: 'mainscene'
	}]
});
