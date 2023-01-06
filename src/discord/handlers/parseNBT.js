var { gunzip } = require('zlib');
const { promisify } = require('util');
inflate = promisify(gunzip);

var parseNBT = async function(str) {
    let buf = Buffer.from(str, 'base64');
    buf = await inflate(buf);

    let index = 0;
    let readByte = () => {
        let v = buf.readInt8(index);
        index++;
        return v;
    };
    let readUShort = () => {
        let v = buf.readUInt16BE(index);
        index += 2;
        return v;
    };
    let readShort = () => {
        let v = buf.readInt16BE(index);
        index += 2;
        return v;
    };
    let readInt = () => {
        let v = buf.readInt32BE(index);
        index += 4;
        return v;
    };
    let readLong = () => {
        let v = buf.readBigInt64BE(index);
        index += 8;
        return v;
    };
    let readFloat = () => {
        let v = buf.readFloatBE(index);
        index += 4;
        return v;
    };
    let readDouble = () => {
        let v = buf.readDoubleBE(index);
        index += 8;
        return v;
    };
    let readByteArr = () => {
        let len = readInt();
        let arr = new Int8Array(buf.buffer.slice(buf.byteOffset + index), 0, len);
        index += len;
        return arr;
    };
    let readIntArr = () => {
        let len = readInt();
        let arr = new Int32Array(buf.buffer.slice(buf.byteOffset + index), 0, len);
        index += len * Int32Array.BYTES_PER_ELEMENT;
        return arr;
    };
    let readLongArr = () => {
        let len = readInt();
        let arr = new BigInt64Array(buf.buffer.slice(buf.byteOffset + index), 0, len);
        index += len * BigInt64Array.BYTES_PER_ELEMENT;
        return arr;
    };
    let readString = () => {
        let len = readUShort();
        let str = buf.toString('utf8', index, index + len);
        index += len;
        return str;
    };
    let readList = () => {
        let type = readByte();
        let read = types[type];
        let len = readInt();
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(read());
        }
        return arr;
    };
    let readCompound = () => {
        let vals = {};
        while (true) {
            let type = readByte();
            if (type === 0) break;

            let name = readString();
            let v = types[type]();
            vals[name] = v;
        }
        return vals;
    };
    let types = [
        readByte,
        readByte,
        readShort,
        readInt,
        readLong,
        readFloat,
        readDouble,
        readByteArr,
        readString,
        readList,
        readCompound,
        readIntArr,
        readLongArr
    ];

    let head = readByte();
    // root must be compound
    if (head !== 0x0A) throw 'root type must be compound';
    return ({
        name: readString(),
        value: readCompound()
    });
};

module.exports = parseNBT;
