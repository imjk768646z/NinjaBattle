/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal.js");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.protobuf = (function() {

    /**
     * Namespace protobuf.
     * @exports protobuf
     * @namespace
     */
    var protobuf = {};

    protobuf.Join = (function() {

        /**
         * Properties of a Join.
         * @memberof protobuf
         * @interface IJoin
         * @property {string|null} [ID] Join ID
         * @property {string|null} [GameState] Join GameState
         * @property {Array.<string>|null} [AllPlayers] Join AllPlayers
         */

        /**
         * Constructs a new Join.
         * @memberof protobuf
         * @classdesc Represents a Join.
         * @implements IJoin
         * @constructor
         * @param {protobuf.IJoin=} [properties] Properties to set
         */
        function Join(properties) {
            this.AllPlayers = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Join ID.
         * @member {string} ID
         * @memberof protobuf.Join
         * @instance
         */
        Join.prototype.ID = "";

        /**
         * Join GameState.
         * @member {string} GameState
         * @memberof protobuf.Join
         * @instance
         */
        Join.prototype.GameState = "";

        /**
         * Join AllPlayers.
         * @member {Array.<string>} AllPlayers
         * @memberof protobuf.Join
         * @instance
         */
        Join.prototype.AllPlayers = $util.emptyArray;

        /**
         * Creates a new Join instance using the specified properties.
         * @function create
         * @memberof protobuf.Join
         * @static
         * @param {protobuf.IJoin=} [properties] Properties to set
         * @returns {protobuf.Join} Join instance
         */
        Join.create = function create(properties) {
            return new Join(properties);
        };

        /**
         * Encodes the specified Join message. Does not implicitly {@link protobuf.Join.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Join
         * @static
         * @param {protobuf.IJoin} message Join message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Join.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            if (message.GameState != null && Object.hasOwnProperty.call(message, "GameState"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.GameState);
            if (message.AllPlayers != null && message.AllPlayers.length)
                for (var i = 0; i < message.AllPlayers.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.AllPlayers[i]);
            return writer;
        };

        /**
         * Encodes the specified Join message, length delimited. Does not implicitly {@link protobuf.Join.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Join
         * @static
         * @param {protobuf.IJoin} message Join message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Join.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Join message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Join
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Join} Join
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Join.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Join();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
                        break;
                    }
                case 2: {
                        message.GameState = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.AllPlayers && message.AllPlayers.length))
                            message.AllPlayers = [];
                        message.AllPlayers.push(reader.string());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Join message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Join
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Join} Join
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Join.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Join message.
         * @function verify
         * @memberof protobuf.Join
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Join.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.GameState != null && message.hasOwnProperty("GameState"))
                if (!$util.isString(message.GameState))
                    return "GameState: string expected";
            if (message.AllPlayers != null && message.hasOwnProperty("AllPlayers")) {
                if (!Array.isArray(message.AllPlayers))
                    return "AllPlayers: array expected";
                for (var i = 0; i < message.AllPlayers.length; ++i)
                    if (!$util.isString(message.AllPlayers[i]))
                        return "AllPlayers: string[] expected";
            }
            return null;
        };

        /**
         * Creates a Join message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Join
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Join} Join
         */
        Join.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Join)
                return object;
            var message = new $root.protobuf.Join();
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.GameState != null)
                message.GameState = String(object.GameState);
            if (object.AllPlayers) {
                if (!Array.isArray(object.AllPlayers))
                    throw TypeError(".protobuf.Join.AllPlayers: array expected");
                message.AllPlayers = [];
                for (var i = 0; i < object.AllPlayers.length; ++i)
                    message.AllPlayers[i] = String(object.AllPlayers[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a Join message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Join
         * @static
         * @param {protobuf.Join} message Join
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Join.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.AllPlayers = [];
            if (options.defaults) {
                object.ID = "";
                object.GameState = "";
            }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.GameState != null && message.hasOwnProperty("GameState"))
                object.GameState = message.GameState;
            if (message.AllPlayers && message.AllPlayers.length) {
                object.AllPlayers = [];
                for (var j = 0; j < message.AllPlayers.length; ++j)
                    object.AllPlayers[j] = message.AllPlayers[j];
            }
            return object;
        };

        /**
         * Converts this Join to JSON.
         * @function toJSON
         * @memberof protobuf.Join
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Join.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Join
         * @function getTypeUrl
         * @memberof protobuf.Join
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Join.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Join";
        };

        return Join;
    })();

    protobuf.MoveInfo = (function() {

        /**
         * Properties of a MoveInfo.
         * @memberof protobuf
         * @interface IMoveInfo
         * @property {protobuf.IJoin|null} [PlayerInfo] MoveInfo PlayerInfo
         * @property {number|null} [x] MoveInfo x
         * @property {number|null} [y] MoveInfo y
         */

        /**
         * Constructs a new MoveInfo.
         * @memberof protobuf
         * @classdesc Represents a MoveInfo.
         * @implements IMoveInfo
         * @constructor
         * @param {protobuf.IMoveInfo=} [properties] Properties to set
         */
        function MoveInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MoveInfo PlayerInfo.
         * @member {protobuf.IJoin|null|undefined} PlayerInfo
         * @memberof protobuf.MoveInfo
         * @instance
         */
        MoveInfo.prototype.PlayerInfo = null;

        /**
         * MoveInfo x.
         * @member {number} x
         * @memberof protobuf.MoveInfo
         * @instance
         */
        MoveInfo.prototype.x = 0;

        /**
         * MoveInfo y.
         * @member {number} y
         * @memberof protobuf.MoveInfo
         * @instance
         */
        MoveInfo.prototype.y = 0;

        /**
         * Creates a new MoveInfo instance using the specified properties.
         * @function create
         * @memberof protobuf.MoveInfo
         * @static
         * @param {protobuf.IMoveInfo=} [properties] Properties to set
         * @returns {protobuf.MoveInfo} MoveInfo instance
         */
        MoveInfo.create = function create(properties) {
            return new MoveInfo(properties);
        };

        /**
         * Encodes the specified MoveInfo message. Does not implicitly {@link protobuf.MoveInfo.verify|verify} messages.
         * @function encode
         * @memberof protobuf.MoveInfo
         * @static
         * @param {protobuf.IMoveInfo} message MoveInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MoveInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.PlayerInfo != null && Object.hasOwnProperty.call(message, "PlayerInfo"))
                $root.protobuf.Join.encode(message.PlayerInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.y);
            return writer;
        };

        /**
         * Encodes the specified MoveInfo message, length delimited. Does not implicitly {@link protobuf.MoveInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.MoveInfo
         * @static
         * @param {protobuf.IMoveInfo} message MoveInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MoveInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MoveInfo message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.MoveInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.MoveInfo} MoveInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MoveInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.MoveInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.PlayerInfo = $root.protobuf.Join.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.x = reader.uint32();
                        break;
                    }
                case 3: {
                        message.y = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MoveInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.MoveInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.MoveInfo} MoveInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MoveInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MoveInfo message.
         * @function verify
         * @memberof protobuf.MoveInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MoveInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.PlayerInfo != null && message.hasOwnProperty("PlayerInfo")) {
                var error = $root.protobuf.Join.verify(message.PlayerInfo);
                if (error)
                    return "PlayerInfo." + error;
            }
            if (message.x != null && message.hasOwnProperty("x"))
                if (!$util.isInteger(message.x))
                    return "x: integer expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (!$util.isInteger(message.y))
                    return "y: integer expected";
            return null;
        };

        /**
         * Creates a MoveInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.MoveInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.MoveInfo} MoveInfo
         */
        MoveInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.MoveInfo)
                return object;
            var message = new $root.protobuf.MoveInfo();
            if (object.PlayerInfo != null) {
                if (typeof object.PlayerInfo !== "object")
                    throw TypeError(".protobuf.MoveInfo.PlayerInfo: object expected");
                message.PlayerInfo = $root.protobuf.Join.fromObject(object.PlayerInfo);
            }
            if (object.x != null)
                message.x = object.x >>> 0;
            if (object.y != null)
                message.y = object.y >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MoveInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.MoveInfo
         * @static
         * @param {protobuf.MoveInfo} message MoveInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MoveInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.PlayerInfo = null;
                object.x = 0;
                object.y = 0;
            }
            if (message.PlayerInfo != null && message.hasOwnProperty("PlayerInfo"))
                object.PlayerInfo = $root.protobuf.Join.toObject(message.PlayerInfo, options);
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = message.y;
            return object;
        };

        /**
         * Converts this MoveInfo to JSON.
         * @function toJSON
         * @memberof protobuf.MoveInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MoveInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MoveInfo
         * @function getTypeUrl
         * @memberof protobuf.MoveInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MoveInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.MoveInfo";
        };

        return MoveInfo;
    })();

    return protobuf;
})();

module.exports = $root;
