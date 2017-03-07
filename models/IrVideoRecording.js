var util = require('./util');
var validation = require('./validation');

module.exports = function(sequelize, DataTypes) {
  // Define table
  var IrVideoRecording = sequelize.define("IrVideoRecording", {
    recordingDateTime: { // Datetime stamp of when the recording started in ISO 8601 format.
      type: DataTypes.DATE
    },
    batteryCharging: DataTypes.STRING,
    batteryLevel: DataTypes.DOUBLE,
    airplaneModeOn: DataTypes.BOOLEAN,
    location: {
      type: DataTypes.GEOMETRY,
      set: util.geometrySetter,
      validate: { isLatLon: validation.isLatLon },
    },
    fileKey: { // Location of the recording file.
      type: DataTypes.STRING,
    },
    recordingTime: { // Timestamp of when the recording started. Just time without timezone.
      type: DataTypes.TIME,
    },
    mimeType: DataTypes.STRING,
    fps: { // FPS of the recording.
      type: DataTypes.INTEGER
    },
    size: { // Size in KB of the recording.
      type: DataTypes.INTEGER,
    },
    duration: { // Duration in seconds of the recording.
      type: DataTypes.INTEGER
    },
    resx: { // Resolution width.
      type: DataTypes.INTEGER
    },
    resy: { // Resolution height.
      type: DataTypes.INTEGER
    },
    locationDatetime: { // Datetime of when the location data was recorded.
      type: DataTypes.DATE
    },
    aditionalMetadata: { // JSON of addition metadata that is not included in the other fields.
      type: DataTypes.JSONB
    },
    tags: { type: DataTypes.JSONB },
    filtered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    filterMetadata: { type: DataTypes.JSONB },
    passedFilter: { type: DataTypes.BOOLEAN },
    public: { type: DataTypes.BOOLEAN }
  }, {
    classMethods: {
      addAssociations: addAssociations,
      apiSettableFields: apiSettableFields,
      findAllWithUser: findAllWithUser,
      getFileData: getFileData,
      apiUpdateableFields: apiUpdateableFields,
    },
    instanceMethods: {
      getFrontendFields: getFrontendFields,
      processRecording: util.processVideo,
      saveFile: util.saveFile,
    }
  });
  return IrVideoRecording;
};

function getFrontendFields() {
  var model = this;
  var group = null;
  if (model.dataValues.Group) {
    group = model.dataValues.Group.dataValues.groupname;
  }
  return {
    id: model.getDataValue('id'),
    recordingDateTime: model.getDataValue('recordingDateTime'),
    recordingTime: model.getDataValue('recordingTime'),
    duration: model.getDataValue('duration'),
    location: model.getDataValue('location'),
    tags: model.getDataValue('tags'),
    fileKey: model.getDataValue('fileKey'),
    batteryCharging: model.get('batteryCharging'),
    batteryLevel: model.get('batteryLevel'),
    airplaneModeOn: model.get('airplaneModeOn'),
    deviceId: model.getDataValue('DeviceId'),
    groupId: model.getDataValue('GroupId'),
    group: group
  };
}

var apiUpdateableFields = [
  'recordingDateTime',
  'recordingTime',
  'location',
  'additionalMetadata',
];

// Fields that are directly settable by the user when uploading.
var apiSettableFields = [
  'recordingDateTime',
  'recordingTime',
  'fileType',
  'fps',
  'size',
  'duration',
  'resx',
  'resy',
  'location',
  'locationDatetime',
  'aditionalMetadata',
  'tags',
  'batteryLevel',
  'batteryCharging',
  'airplaneModeOn',
];

function addAssociations(models) {
  models.IrVideoRecording.belongsTo(models.Group);
}

function findAllWithUser(user, queryParams) {
  return util.findAllWithUser(this, user, queryParams);
}

function getFileData(id, user) {
  return util.getFileData(this, id, user);
}
