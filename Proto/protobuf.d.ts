
namespace protobuf {
    // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.

/** Namespace protobuf. */
export namespace protobuf {

    /** Properties of a Join. */
    interface IJoin {

        /** Join ID */
        ID?: (string|null);

        /** Join GameState */
        GameState?: (string|null);

        /** Join AllPlayers */
        AllPlayers?: (string[]|null);
    }

    /** Represents a Join. */
    class Join implements IJoin {

        /**
         * Constructs a new Join.
         * @param [properties] Properties to set
         */
        constructor(properties?: protobuf.IJoin);

        /** Join ID. */
        public ID: string;

        /** Join GameState. */
        public GameState: string;

        /** Join AllPlayers. */
        public AllPlayers: string[];

        /**
         * Creates a new Join instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Join instance
         */
        public static create(properties?: protobuf.IJoin): protobuf.Join;

        /**
         * Encodes the specified Join message. Does not implicitly {@link protobuf.Join.verify|verify} messages.
         * @param message Join message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protobuf.IJoin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Join message, length delimited. Does not implicitly {@link protobuf.Join.verify|verify} messages.
         * @param message Join message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: protobuf.IJoin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Join message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Join
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protobuf.Join;

        /**
         * Decodes a Join message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Join
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): protobuf.Join;

        /**
         * Verifies a Join message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Join message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Join
         */
        public static fromObject(object: { [k: string]: any }): protobuf.Join;

        /**
         * Creates a plain object from a Join message. Also converts values to other types if specified.
         * @param message Join
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: protobuf.Join, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Join to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Join
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MoveInfo. */
    interface IMoveInfo {

        /** MoveInfo PlayerInfo */
        PlayerInfo?: (protobuf.IJoin|null);

        /** MoveInfo x */
        x?: (number|null);

        /** MoveInfo y */
        y?: (number|null);
    }

    /** Represents a MoveInfo. */
    class MoveInfo implements IMoveInfo {

        /**
         * Constructs a new MoveInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: protobuf.IMoveInfo);

        /** MoveInfo PlayerInfo. */
        public PlayerInfo?: (protobuf.IJoin|null);

        /** MoveInfo x. */
        public x: number;

        /** MoveInfo y. */
        public y: number;

        /**
         * Creates a new MoveInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MoveInfo instance
         */
        public static create(properties?: protobuf.IMoveInfo): protobuf.MoveInfo;

        /**
         * Encodes the specified MoveInfo message. Does not implicitly {@link protobuf.MoveInfo.verify|verify} messages.
         * @param message MoveInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: protobuf.IMoveInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MoveInfo message, length delimited. Does not implicitly {@link protobuf.MoveInfo.verify|verify} messages.
         * @param message MoveInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: protobuf.IMoveInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MoveInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MoveInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): protobuf.MoveInfo;

        /**
         * Decodes a MoveInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MoveInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): protobuf.MoveInfo;

        /**
         * Verifies a MoveInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MoveInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MoveInfo
         */
        public static fromObject(object: { [k: string]: any }): protobuf.MoveInfo;

        /**
         * Creates a plain object from a MoveInfo message. Also converts values to other types if specified.
         * @param message MoveInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: protobuf.MoveInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MoveInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MoveInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

}
export default protobuf;
