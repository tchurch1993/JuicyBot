const { getInfo } = require("ytdl-core");
const {
  AudioResource,
  createAudioResource,
  demuxProbe,
} = require("@discordjs/voice");
const { raw } = require("youtube-dl-exec");
const { Readable } = require("stream");

/**
 * This is the data required to create a Track object
 */
// export interface TrackData {
//   url: string;
//   title: string;
//   onStart: () => void;
//   onFinish: () => void;
//   onError: (error: Error) => void;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
module.exports = class Track {
  constructor({ url, title, type, onStart, onFinish, onError, buffer }) {
    this.url = url;
    this.title = title;
    this.buffer = buffer;
    this.type = type;
    this.onStart = onStart;
    this.onFinish = onFinish;
    this.onError = onError;
  }

  /**
   * Creates an AudioResource from this Track.
   */
  createAudioResource() {
    switch (this.type) {
      case "url":
      case "file":
        return new Promise((resolve, reject) => {
          const process = raw(
            this.url,
            {
              o: "-",
              q: "",
              f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
              r: "100K",
            },
            { stdio: ["ignore", "pipe", "ignore"] }
          );
          if (!process.stdout) {
            reject(new Error("No stdout"));
            return;
          }
          const stream = process.stdout;
          const onError = (error) => {
            if (!process.killed) process.kill();
            stream.resume();
            reject(error);
          };
          process
            .once("spawn", () => {
              demuxProbe(stream)
                .then((probe) =>
                  resolve(
                    createAudioResource(probe.stream, {
                      inlineVolume: true,
                      metadata: this,
                      inputType: probe.type,
                    })
                  )
                )
                .catch(onError);
            })
            .catch(onError);
        });
      case "buffer":
        try {
          return new Promise((resolve, reject) => {
            const buffer = this.buffer;
            const stream = Readable.from(buffer);

            resolve(
              createAudioSource(stream, {
                inlineVolume: true,
                metadata: this,
                inputType: "webm/opus",
              })
            );
          });
        } catch (error) {
          this.onError(error);
        }
    }
  }

  /**
   * creates an AudioResource from a sound
   */
  createSoundResource() {
    //if type is equal to "url" or "file"

    if (this.type === "url" || this.type === "file") {
      return createAudioResource(this.url, {
        metadata: this,
      });
    } else {
      return createAudioResource(Readable.from(this.buffer), {
        metadata: this,
      });
    }
  }

  /**
   * Creates a Track from a video URL and lifecycle callback methods.
   *
   * @param url The URL of the video
   * @param methods Lifecycle callbacks
   * @returns The created Track
   */
  static async from(url, methods) {
    const info = await getInfo(url);

    // The methods are wrapped so that we can ensure that they are only called once.
    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = noop;
        methods.onStart();
      },
      onFinish() {
        wrappedMethods.onFinish = noop;
        methods.onFinish();
      },
      onError(error) {
        wrappedMethods.onError = noop;
        methods.onError(error);
      },
    };

    return new Track({
      title: info.videoDetails.title,
      url: url,
      type: "url",
      ...wrappedMethods,
    });
  }

  /**
   * Creates a Track from a sound file and lifecycle callback methods.
   * @param stream The URL of the sound file
   * @param methods Lifecycle callbacks
   * @returns The created Track
   */
  static async fromBuffer(buffer, methods) {
    // The methods are wrapped so that we can ensure that they are only called once.
    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = noop;
        methods.onStart();
      },
      onFinish() {
        wrappedMethods.onFinish = noop;
        methods.onFinish();
      },
      onError() {
        wrappedMethods.onError = noop;
        methods.onError();
      },
    };
    return new Track({
      title: "buffer",
      url: null,
      type: "buffer",
      ...wrappedMethods,
      buffer: buffer,
    });
  }

  /**
   *  Creates a Track from a sound file path and lifecycle callback methods.
   * @param path The path to the sound file
   * @param methods Lifecycle callbacks
   * @returns The created Track
   */
  static async fromFile(path, methods) {
    // The methods are wrapped so that we can ensure that they are only called once.
    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = noop;
        methods.onStart();
      },
      onFinish() {
        wrappedMethods.onFinish = noop;
        methods.onFinish();
      },
      onError(error) {
        wrappedMethods.onError = noop;
        methods.onError(error);
      },
    };
    return new Track({
      title: path,
      url: path,
      type: "file",
      ...methods,
    });
  }
};
