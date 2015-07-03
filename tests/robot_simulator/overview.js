var ProtoBuf = require('protobufjs');
var zmq = require('zmq');

var builder = ProtoBuf.loadProtoFile({
	root: '../../public/resources/js/proto',
	file: 'messages/support/nubugger/proto/Message.proto'
});

var API = builder.build('messages.support.nubugger.proto');
API.Overview = builder.build('messages.support.nubugger.proto.Overview');
API.Behaviour = builder.build('messages.behaviour.proto.Behaviour');
API.GameState = builder.build('messages.input.proto.GameState');

var type = API.Message.Type.OVERVIEW;
var filterId = 0;

var socket = zmq.socket('pub');
socket.bindSync('tcp://0.0.0.0:14000');

function randFloat(min, max) {
	return Math.random() * (max - min) + min;
}

setInterval(function () {
	var now = Date.now();
	var robotHeading = {
		x: 0,//Math.random() * 2 - 1,
		y: 1//Math.random() * 2 - 1
	};

	var robotHeadingLength = Math.sqrt(robotHeading.x * robotHeading.x + robotHeading.y * robotHeading.y);

	robotHeading.x /= robotHeadingLength;
	robotHeading.y /= robotHeadingLength;

	var message = new API.Message({
		type: type,
		filter_id: filterId,
		utc_timestamp: Date.now(),
		overview: {
			voltage: randFloat(10, 13),
			battery: Math.random(),
			behaviour_state: API.Behaviour.State.INIT,
			robot_position: {x: Math.random(), y: Math.random()},
			robot_position_covariance: {x: {x: Math.random(), y: Math.random()}, y: {x: Math.random(), y: Math.random()}},
			robot_heading: robotHeading,
			ball_position: {x: 1, y: 1},
			ball_world_position: {x: 0.5, y: -0.5},
			game_mode: API.GameState.Data.Mode.NORMAL,
			game_phase: API.GameState.Data.Phase.INITIAL,
			penalty_reason: API.GameState.Data.PenaltyReason.UNPENALISED,
			last_camera_image: now - 5000 * Math.random(),
			last_seen_ball: now - 5000 * Math.random(),
			last_seen_goal: now - 15000 * Math.random()
		}
	});

	var buffer = message.toBuffer();
	var finalBuffer = new Buffer(buffer.length + 2);
	finalBuffer.writeUInt8(type, 0);
	finalBuffer.writeUInt8(filterId, 1);
	buffer.copy(finalBuffer, 2);
	socket.send(finalBuffer);

}, 1000);

