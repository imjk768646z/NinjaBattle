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

    protobuf.Move = (function() {

        /**
         * Properties of a Move.
         * @memberof protobuf
         * @interface IMove
         * @property {string|null} [ID] Move ID
         * @property {boolean|null} [IsGoRight] Move IsGoRight
         */

        /**
         * Constructs a new Move.
         * @memberof protobuf
         * @classdesc Represents a Move.
         * @implements IMove
         * @constructor
         * @param {protobuf.IMove=} [properties] Properties to set
         */
        function Move(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Move ID.
         * @member {string} ID
         * @memberof protobuf.Move
         * @instance
         */
        Move.prototype.ID = "";

        /**
         * Move IsGoRight.
         * @member {boolean} IsGoRight
         * @memberof protobuf.Move
         * @instance
         */
        Move.prototype.IsGoRight = false;

        /**
         * Creates a new Move instance using the specified properties.
         * @function create
         * @memberof protobuf.Move
         * @static
         * @param {protobuf.IMove=} [properties] Properties to set
         * @returns {protobuf.Move} Move instance
         */
        Move.create = function create(properties) {
            return new Move(properties);
        };

        /**
         * Encodes the specified Move message. Does not implicitly {@link protobuf.Move.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Move
         * @static
         * @param {protobuf.IMove} message Move message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Move.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            if (message.IsGoRight != null && Object.hasOwnProperty.call(message, "IsGoRight"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.IsGoRight);
            return writer;
        };

        /**
         * Encodes the specified Move message, length delimited. Does not implicitly {@link protobuf.Move.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Move
         * @static
         * @param {protobuf.IMove} message Move message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Move.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Move message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Move
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Move} Move
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Move.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Move();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
                        break;
                    }
                case 2: {
                        message.IsGoRight = reader.bool();
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
         * Decodes a Move message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Move
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Move} Move
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Move.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Move message.
         * @function verify
         * @memberof protobuf.Move
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Move.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.IsGoRight != null && message.hasOwnProperty("IsGoRight"))
                if (typeof message.IsGoRight !== "boolean")
                    return "IsGoRight: boolean expected";
            return null;
        };

        /**
         * Creates a Move message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Move
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Move} Move
         */
        Move.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Move)
                return object;
            var message = new $root.protobuf.Move();
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.IsGoRight != null)
                message.IsGoRight = Boolean(object.IsGoRight);
            return message;
        };

        /**
         * Creates a plain object from a Move message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Move
         * @static
         * @param {protobuf.Move} message Move
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Move.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ID = "";
                object.IsGoRight = false;
            }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.IsGoRight != null && message.hasOwnProperty("IsGoRight"))
                object.IsGoRight = message.IsGoRight;
            return object;
        };

        /**
         * Converts this Move to JSON.
         * @function toJSON
         * @memberof protobuf.Move
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Move.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Move
         * @function getTypeUrl
         * @memberof protobuf.Move
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Move.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Move";
        };

        return Move;
    })();

    protobuf.Stop = (function() {

        /**
         * Properties of a Stop.
         * @memberof protobuf
         * @interface IStop
         * @property {string|null} [ID] Stop ID
         * @property {boolean|null} [IsStopGoRight] Stop IsStopGoRight
         */

        /**
         * Constructs a new Stop.
         * @memberof protobuf
         * @classdesc Represents a Stop.
         * @implements IStop
         * @constructor
         * @param {protobuf.IStop=} [properties] Properties to set
         */
        function Stop(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Stop ID.
         * @member {string} ID
         * @memberof protobuf.Stop
         * @instance
         */
        Stop.prototype.ID = "";

        /**
         * Stop IsStopGoRight.
         * @member {boolean} IsStopGoRight
         * @memberof protobuf.Stop
         * @instance
         */
        Stop.prototype.IsStopGoRight = false;

        /**
         * Creates a new Stop instance using the specified properties.
         * @function create
         * @memberof protobuf.Stop
         * @static
         * @param {protobuf.IStop=} [properties] Properties to set
         * @returns {protobuf.Stop} Stop instance
         */
        Stop.create = function create(properties) {
            return new Stop(properties);
        };

        /**
         * Encodes the specified Stop message. Does not implicitly {@link protobuf.Stop.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Stop
         * @static
         * @param {protobuf.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            if (message.IsStopGoRight != null && Object.hasOwnProperty.call(message, "IsStopGoRight"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.IsStopGoRight);
            return writer;
        };

        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link protobuf.Stop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Stop
         * @static
         * @param {protobuf.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Stop();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
                        break;
                    }
                case 2: {
                        message.IsStopGoRight = reader.bool();
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
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stop message.
         * @function verify
         * @memberof protobuf.Stop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.IsStopGoRight != null && message.hasOwnProperty("IsStopGoRight"))
                if (typeof message.IsStopGoRight !== "boolean")
                    return "IsStopGoRight: boolean expected";
            return null;
        };

        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Stop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Stop} Stop
         */
        Stop.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Stop)
                return object;
            var message = new $root.protobuf.Stop();
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.IsStopGoRight != null)
                message.IsStopGoRight = Boolean(object.IsStopGoRight);
            return message;
        };

        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Stop
         * @static
         * @param {protobuf.Stop} message Stop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stop.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ID = "";
                object.IsStopGoRight = false;
            }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.IsStopGoRight != null && message.hasOwnProperty("IsStopGoRight"))
                object.IsStopGoRight = message.IsStopGoRight;
            return object;
        };

        /**
         * Converts this Stop to JSON.
         * @function toJSON
         * @memberof protobuf.Stop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Stop
         * @function getTypeUrl
         * @memberof protobuf.Stop
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Stop.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Stop";
        };

        return Stop;
    })();

    protobuf.Jump = (function() {

        /**
         * Properties of a Jump.
         * @memberof protobuf
         * @interface IJump
         * @property {string|null} [ID] Jump ID
         */

        /**
         * Constructs a new Jump.
         * @memberof protobuf
         * @classdesc Represents a Jump.
         * @implements IJump
         * @constructor
         * @param {protobuf.IJump=} [properties] Properties to set
         */
        function Jump(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Jump ID.
         * @member {string} ID
         * @memberof protobuf.Jump
         * @instance
         */
        Jump.prototype.ID = "";

        /**
         * Creates a new Jump instance using the specified properties.
         * @function create
         * @memberof protobuf.Jump
         * @static
         * @param {protobuf.IJump=} [properties] Properties to set
         * @returns {protobuf.Jump} Jump instance
         */
        Jump.create = function create(properties) {
            return new Jump(properties);
        };

        /**
         * Encodes the specified Jump message. Does not implicitly {@link protobuf.Jump.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Jump
         * @static
         * @param {protobuf.IJump} message Jump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Jump.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            return writer;
        };

        /**
         * Encodes the specified Jump message, length delimited. Does not implicitly {@link protobuf.Jump.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Jump
         * @static
         * @param {protobuf.IJump} message Jump message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Jump.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Jump message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Jump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Jump} Jump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Jump.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Jump();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
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
         * Decodes a Jump message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Jump
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Jump} Jump
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Jump.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Jump message.
         * @function verify
         * @memberof protobuf.Jump
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Jump.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            return null;
        };

        /**
         * Creates a Jump message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Jump
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Jump} Jump
         */
        Jump.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Jump)
                return object;
            var message = new $root.protobuf.Jump();
            if (object.ID != null)
                message.ID = String(object.ID);
            return message;
        };

        /**
         * Creates a plain object from a Jump message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Jump
         * @static
         * @param {protobuf.Jump} message Jump
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Jump.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.ID = "";
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            return object;
        };

        /**
         * Converts this Jump to JSON.
         * @function toJSON
         * @memberof protobuf.Jump
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Jump.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Jump
         * @function getTypeUrl
         * @memberof protobuf.Jump
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Jump.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Jump";
        };

        return Jump;
    })();

    protobuf.Attack = (function() {

        /**
         * Properties of an Attack.
         * @memberof protobuf
         * @interface IAttack
         * @property {string|null} [ID] Attack ID
         */

        /**
         * Constructs a new Attack.
         * @memberof protobuf
         * @classdesc Represents an Attack.
         * @implements IAttack
         * @constructor
         * @param {protobuf.IAttack=} [properties] Properties to set
         */
        function Attack(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Attack ID.
         * @member {string} ID
         * @memberof protobuf.Attack
         * @instance
         */
        Attack.prototype.ID = "";

        /**
         * Creates a new Attack instance using the specified properties.
         * @function create
         * @memberof protobuf.Attack
         * @static
         * @param {protobuf.IAttack=} [properties] Properties to set
         * @returns {protobuf.Attack} Attack instance
         */
        Attack.create = function create(properties) {
            return new Attack(properties);
        };

        /**
         * Encodes the specified Attack message. Does not implicitly {@link protobuf.Attack.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Attack
         * @static
         * @param {protobuf.IAttack} message Attack message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Attack.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            return writer;
        };

        /**
         * Encodes the specified Attack message, length delimited. Does not implicitly {@link protobuf.Attack.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Attack
         * @static
         * @param {protobuf.IAttack} message Attack message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Attack.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Attack message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Attack
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Attack} Attack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Attack.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Attack();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
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
         * Decodes an Attack message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Attack
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Attack} Attack
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Attack.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Attack message.
         * @function verify
         * @memberof protobuf.Attack
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Attack.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            return null;
        };

        /**
         * Creates an Attack message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Attack
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Attack} Attack
         */
        Attack.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Attack)
                return object;
            var message = new $root.protobuf.Attack();
            if (object.ID != null)
                message.ID = String(object.ID);
            return message;
        };

        /**
         * Creates a plain object from an Attack message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Attack
         * @static
         * @param {protobuf.Attack} message Attack
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Attack.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.ID = "";
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            return object;
        };

        /**
         * Converts this Attack to JSON.
         * @function toJSON
         * @memberof protobuf.Attack
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Attack.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Attack
         * @function getTypeUrl
         * @memberof protobuf.Attack
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Attack.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Attack";
        };

        return Attack;
    })();

    protobuf.Damage = (function() {

        /**
         * Properties of a Damage.
         * @memberof protobuf
         * @interface IDamage
         * @property {string|null} [ID] Damage ID
         * @property {number|null} [DamagePower] Damage DamagePower
         */

        /**
         * Constructs a new Damage.
         * @memberof protobuf
         * @classdesc Represents a Damage.
         * @implements IDamage
         * @constructor
         * @param {protobuf.IDamage=} [properties] Properties to set
         */
        function Damage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Damage ID.
         * @member {string} ID
         * @memberof protobuf.Damage
         * @instance
         */
        Damage.prototype.ID = "";

        /**
         * Damage DamagePower.
         * @member {number} DamagePower
         * @memberof protobuf.Damage
         * @instance
         */
        Damage.prototype.DamagePower = 0;

        /**
         * Creates a new Damage instance using the specified properties.
         * @function create
         * @memberof protobuf.Damage
         * @static
         * @param {protobuf.IDamage=} [properties] Properties to set
         * @returns {protobuf.Damage} Damage instance
         */
        Damage.create = function create(properties) {
            return new Damage(properties);
        };

        /**
         * Encodes the specified Damage message. Does not implicitly {@link protobuf.Damage.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Damage
         * @static
         * @param {protobuf.IDamage} message Damage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Damage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            if (message.DamagePower != null && Object.hasOwnProperty.call(message, "DamagePower"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.DamagePower);
            return writer;
        };

        /**
         * Encodes the specified Damage message, length delimited. Does not implicitly {@link protobuf.Damage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Damage
         * @static
         * @param {protobuf.IDamage} message Damage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Damage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Damage message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Damage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Damage} Damage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Damage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Damage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
                        break;
                    }
                case 2: {
                        message.DamagePower = reader.uint32();
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
         * Decodes a Damage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Damage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Damage} Damage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Damage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Damage message.
         * @function verify
         * @memberof protobuf.Damage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Damage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.DamagePower != null && message.hasOwnProperty("DamagePower"))
                if (!$util.isInteger(message.DamagePower))
                    return "DamagePower: integer expected";
            return null;
        };

        /**
         * Creates a Damage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Damage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Damage} Damage
         */
        Damage.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Damage)
                return object;
            var message = new $root.protobuf.Damage();
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.DamagePower != null)
                message.DamagePower = object.DamagePower >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Damage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Damage
         * @static
         * @param {protobuf.Damage} message Damage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Damage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ID = "";
                object.DamagePower = 0;
            }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.DamagePower != null && message.hasOwnProperty("DamagePower"))
                object.DamagePower = message.DamagePower;
            return object;
        };

        /**
         * Converts this Damage to JSON.
         * @function toJSON
         * @memberof protobuf.Damage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Damage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Damage
         * @function getTypeUrl
         * @memberof protobuf.Damage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Damage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Damage";
        };

        return Damage;
    })();

    protobuf.Die = (function() {

        /**
         * Properties of a Die.
         * @memberof protobuf
         * @interface IDie
         * @property {string|null} [ID] Die ID
         */

        /**
         * Constructs a new Die.
         * @memberof protobuf
         * @classdesc Represents a Die.
         * @implements IDie
         * @constructor
         * @param {protobuf.IDie=} [properties] Properties to set
         */
        function Die(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Die ID.
         * @member {string} ID
         * @memberof protobuf.Die
         * @instance
         */
        Die.prototype.ID = "";

        /**
         * Creates a new Die instance using the specified properties.
         * @function create
         * @memberof protobuf.Die
         * @static
         * @param {protobuf.IDie=} [properties] Properties to set
         * @returns {protobuf.Die} Die instance
         */
        Die.create = function create(properties) {
            return new Die(properties);
        };

        /**
         * Encodes the specified Die message. Does not implicitly {@link protobuf.Die.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Die
         * @static
         * @param {protobuf.IDie} message Die message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Die.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            return writer;
        };

        /**
         * Encodes the specified Die message, length delimited. Does not implicitly {@link protobuf.Die.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Die
         * @static
         * @param {protobuf.IDie} message Die message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Die.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Die message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Die
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Die} Die
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Die.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Die();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
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
         * Decodes a Die message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Die
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Die} Die
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Die.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Die message.
         * @function verify
         * @memberof protobuf.Die
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Die.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            return null;
        };

        /**
         * Creates a Die message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Die
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Die} Die
         */
        Die.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Die)
                return object;
            var message = new $root.protobuf.Die();
            if (object.ID != null)
                message.ID = String(object.ID);
            return message;
        };

        /**
         * Creates a plain object from a Die message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Die
         * @static
         * @param {protobuf.Die} message Die
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Die.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.ID = "";
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            return object;
        };

        /**
         * Converts this Die to JSON.
         * @function toJSON
         * @memberof protobuf.Die
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Die.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Die
         * @function getTypeUrl
         * @memberof protobuf.Die
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Die.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.Die";
        };

        return Die;
    })();

    protobuf.PositionInfo = (function() {

        /**
         * Properties of a PositionInfo.
         * @memberof protobuf
         * @interface IPositionInfo
         * @property {string|null} [ID] PositionInfo ID
         * @property {number|null} [X] PositionInfo X
         * @property {number|null} [Y] PositionInfo Y
         */

        /**
         * Constructs a new PositionInfo.
         * @memberof protobuf
         * @classdesc Represents a PositionInfo.
         * @implements IPositionInfo
         * @constructor
         * @param {protobuf.IPositionInfo=} [properties] Properties to set
         */
        function PositionInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PositionInfo ID.
         * @member {string} ID
         * @memberof protobuf.PositionInfo
         * @instance
         */
        PositionInfo.prototype.ID = "";

        /**
         * PositionInfo X.
         * @member {number} X
         * @memberof protobuf.PositionInfo
         * @instance
         */
        PositionInfo.prototype.X = 0;

        /**
         * PositionInfo Y.
         * @member {number} Y
         * @memberof protobuf.PositionInfo
         * @instance
         */
        PositionInfo.prototype.Y = 0;

        /**
         * Creates a new PositionInfo instance using the specified properties.
         * @function create
         * @memberof protobuf.PositionInfo
         * @static
         * @param {protobuf.IPositionInfo=} [properties] Properties to set
         * @returns {protobuf.PositionInfo} PositionInfo instance
         */
        PositionInfo.create = function create(properties) {
            return new PositionInfo(properties);
        };

        /**
         * Encodes the specified PositionInfo message. Does not implicitly {@link protobuf.PositionInfo.verify|verify} messages.
         * @function encode
         * @memberof protobuf.PositionInfo
         * @static
         * @param {protobuf.IPositionInfo} message PositionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PositionInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ID);
            if (message.X != null && Object.hasOwnProperty.call(message, "X"))
                writer.uint32(/* id 2, wireType 1 =*/17).double(message.X);
            if (message.Y != null && Object.hasOwnProperty.call(message, "Y"))
                writer.uint32(/* id 3, wireType 1 =*/25).double(message.Y);
            return writer;
        };

        /**
         * Encodes the specified PositionInfo message, length delimited. Does not implicitly {@link protobuf.PositionInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.PositionInfo
         * @static
         * @param {protobuf.IPositionInfo} message PositionInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PositionInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PositionInfo message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.PositionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.PositionInfo} PositionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PositionInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.PositionInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ID = reader.string();
                        break;
                    }
                case 2: {
                        message.X = reader.double();
                        break;
                    }
                case 3: {
                        message.Y = reader.double();
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
         * Decodes a PositionInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.PositionInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.PositionInfo} PositionInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PositionInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PositionInfo message.
         * @function verify
         * @memberof protobuf.PositionInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PositionInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ID != null && message.hasOwnProperty("ID"))
                if (!$util.isString(message.ID))
                    return "ID: string expected";
            if (message.X != null && message.hasOwnProperty("X"))
                if (typeof message.X !== "number")
                    return "X: number expected";
            if (message.Y != null && message.hasOwnProperty("Y"))
                if (typeof message.Y !== "number")
                    return "Y: number expected";
            return null;
        };

        /**
         * Creates a PositionInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.PositionInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.PositionInfo} PositionInfo
         */
        PositionInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.PositionInfo)
                return object;
            var message = new $root.protobuf.PositionInfo();
            if (object.ID != null)
                message.ID = String(object.ID);
            if (object.X != null)
                message.X = Number(object.X);
            if (object.Y != null)
                message.Y = Number(object.Y);
            return message;
        };

        /**
         * Creates a plain object from a PositionInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.PositionInfo
         * @static
         * @param {protobuf.PositionInfo} message PositionInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PositionInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ID = "";
                object.X = 0;
                object.Y = 0;
            }
            if (message.ID != null && message.hasOwnProperty("ID"))
                object.ID = message.ID;
            if (message.X != null && message.hasOwnProperty("X"))
                object.X = options.json && !isFinite(message.X) ? String(message.X) : message.X;
            if (message.Y != null && message.hasOwnProperty("Y"))
                object.Y = options.json && !isFinite(message.Y) ? String(message.Y) : message.Y;
            return object;
        };

        /**
         * Converts this PositionInfo to JSON.
         * @function toJSON
         * @memberof protobuf.PositionInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PositionInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PositionInfo
         * @function getTypeUrl
         * @memberof protobuf.PositionInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PositionInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/protobuf.PositionInfo";
        };

        return PositionInfo;
    })();

    return protobuf;
})();

module.exports = $root;
