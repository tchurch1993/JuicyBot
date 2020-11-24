const fs = require('fs');

class Audio {

    /**
     * @param rawPCM buffer || binary
     * @param options.numChannels
     * @param options.sampleRate 
     * @param options.byteRate
     * @return Buffer
     * @throws Exception
     */
    static encodeWav(rawPCM, options) {
        if (typeof rawPCM === 'string') {
            rawPCM = Buffer.from(rawPCM, 'binary')
        }

        if (!Buffer.isBuffer(rawPCM)) {
            throw new TypeError('pcm data must be Buffer or string')
        }
        const opt = options || {}
        const sampleRate = opt.sampleRate || 16000
        const numChannels = opt.numChannels || 1
        const byteRate = opt.byteRate || 16

        const buf = rawPCM
        const header = new Buffer.alloc(44)

        header.write('RIFF', 0)
        header.writeUInt32LE(buf.length - 8, 4)
        header.write('WAVE', 8)
        header.write('fmt ', 12)
        header.writeUInt8(16, 16)
        header.writeUInt8(1, 20)
        header.writeUInt8(numChannels, 22)
        header.writeUInt32LE(sampleRate, 24)
        header.writeUInt32LE(byteRate, 28)
        header.writeUInt8(4, 32)
        header.writeUInt8(16, 34)
        header.write('data', 36)
        header.writeUInt32LE(buf.length - 44, 40)

        return Buffer.concat([header, buf])
    }


    static decodeWav(rawWav) {
        if (typeof rawWav === 'string') {
            rawWav = Buffer.from(rawWav, 'binary')
        }

        if (!Buffer.isBuffer(rawWav)) {
            throw new TypeError('pcm data must be Buffer or string')
        }

        // remove the header of pcm format
        rawWav = rawWav.slice(44)

        return rawWav
    }

    static rawToWav(rawBuffer) {
        try {
            var pcmData = rawBuffer;
            var wavData = this.encodeWav(pcmData, {
                numChannels: 2,
                sampleRate: 48000,
                byteRate: 16
            })
            return wavData;
        } catch (error) {
            console.error(error)
        }

    }
}

module.exports = Audio;