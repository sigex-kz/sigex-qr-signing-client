// @ts-check

((exports, window) => { // eslint-disable-line max-classes-per-file
  /**
   * Класс ошибок QRSigningError.
   */
  class QRSigningError extends Error {
    constructor(message, details) {
      super(message);
      this.name = 'QRSigningError';
      this.details = details;
    }
  }

  /**
   * Класс клиента подписания через QR для произвольных данных (формирует CMS подписи).
   */
  class QRSigningClientCMS {
    /**
     * Конструктор.
     *
     * @param {String} description описание подписываемых данных.
     *
     * @param {Boolean} [attach = false] следует ли включить в подпись подписываемые данные.
     *
     * @param {String} [baseUrl = 'https://sigex.kz'] базовый URL сервиса SIGEX.
     */
    constructor(description, attach = false, baseUrl = 'https://sigex.kz') {
      this.description = description;
      this.attach = attach;
      this.baseUrl = baseUrl;
      this.retries = 25;
      this.documentsToSign = [];
      this.expireAt = null;
      this.dataURL = null;
      this.signURL = null;
      this.qrCode = null;
      this.eGovMobileLaunchLink = null;
    }

    /**
     * Добавить блок данных для подписания, зачастую речь идет о файле.
     *
     * @param {String[]} names массив имен подписываемого блока данных на разных языках
     * [ru, kk, en]. Массив должен сожердать как минимум одну строку, в этом случае она будет
     * использоваться для всех языков.
     *
     * @param {String | ArrayBuffer} data данные, которые нужно подписать, в виде строки Base64 либо
     * ArrayBuffer.
     *
     * @param {Object[]} [meta = []] опциональный массив объектов метаданных, содержащих поля
     * `"name"` и `"value"` со строковыми значениями.
     *
     * @param {Boolean} [isPDF = false] опциональная подсказка для приложения eGov mobile помогающая
     * ему лучше подобрать приложение для отображения данных перед подписанием.
     *
     * @throws QRSigningError
     */
    addDataToSign(names, data, meta = [], isPDF = false) {
      if (names.length === 0) {
        throw new QRSigningError('Данные на подписание предоставлены не корректно.', 'Необходимо указать хотябы одно имя для подписываемых данных.');
      }

      const documentToSign = {
        id: this.documentsToSign.length + 1,
        nameRu: names[0],
        nameKz: names[1] ? names[1] : names[0],
        nameEn: names[2] ? names[2] : names[0],
        meta,
        document: {
          file: {
            mime: isPDF ? '@file/pdf' : '',
            data: (typeof data === 'string') ? data : QRSigningClientCMS.arrayBufferToB64(data),
          },
        },
      };

      this.documentsToSign.push(documentToSign);
    }

    /**
     * Зарегистрировать процедуру QR подписания.
     *
     * @returns {Promise<String>} изображение QR кода в Base64 кодировке.
     *
     * @throws QRSigningError
     */
    async registerQRSinging() {
      try {
        const data = {
          description: this.description,
        };

        const response = await fetch(
          `${this.baseUrl}/api/egovQr`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          throw new Error(`Сервер вернул статус '${response.status}: ${response.statusText}'`);
        }

        const responseJson = await response.json();

        if (responseJson.message) {
          throw new Error(responseJson.message);
        }

        this.qrCode = responseJson.qrCode;
        this.dataURL = responseJson.dataURL;
        this.signURL = responseJson.signURL;
        this.eGovMobileLaunchLink = responseJson.eGovMobileLaunchLink;

        return this.qrCode;
      } catch (err) {
        throw new QRSigningError('Не удалось зарегистрировать новый идентификатор QR.', err);
      }
    }

    /**
     * Получить QR код (необходимо предварительно выполнить регистрацию).
     *
     * @returns {String} изображение QR кода в Base64 кодировке.
     */
    getQR() {
      return this.qrCode;
    }

    /**
     * Получить ссылку для запуска процедуры подписания в eGov mobile (кросс подписание)
     * - для тех случаев, когда нужно выполнять подписание на том же самом устройстве, без
     * необходимости сканировать QR код (необходимо предварительно выполнить регистрацию).
     *
     * @returns {String} ссылка для запуска процедуры подписания в eGov mobile.
     */
    getEGovMobileLaunchLink() {
      return this.eGovMobileLaunchLink;
    }

    /**
     * Получить подписи под данными. Это может занять много времени, так как в
     * процессе выполнения данные будут отправлены в eGov mobile, далее нужно
     * будет дождаться пока пользователь подпишет данные и подписи будут выкачены
     * обратно.
     *
     * @param {Function} [dataSentCallback] опциональная функция, которая будет вызвана после
     * того, как данные для подписания будут переданы на сервер. Может быть использована для
     * того, чтобы перестать отображать QR код, так как он больше не действителен.
     *
     * @returns {Promise<String[]>} массив подписей под зарегистрированными блоками данных.
     *
     * @throws QRSigningError
     */
    async getSignatures(dataSentCallback) {
      if (this.documentsToSign.length === 0) {
        throw new QRSigningError('Данные на подписание предоставлены не корректно.', 'Не зарегистрировано ни одного блока данных для подписания.');
      }

      // Отправка данных
      try {
        const data = {
          signMethod: this.attach ? 'CMS_WITH_DATA' : 'CMS_SIGN_ONLY',
          documentsToSign: this.documentsToSign,
        };

        let response;

        for (let i = 0; i < this.retries; i += 1) {
          try {
            response = await fetch( // eslint-disable-line no-await-in-loop
              this.dataURL,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify(data),
              },
            );

            // Будем пытаться отправлять запросы до тех пор, пока не получим ответа.
            break;
          } catch (err) {
            // Игнорируем исключение и пробуем снова.
          }
        }

        if (!response) {
          throw new Error(`Не удалось получить ответа от сервера ${this.dataURL}.`);
        }

        if (!response.ok) {
          throw new Error(`Сервер вернул статус '${response.status}: ${response.statusText}'`);
        }

        const responseJson = await response.json();

        if (responseJson.message) {
          throw new Error(responseJson.message);
        }
      } catch (err) {
        throw new QRSigningError('Не удалось отправить данные.', err);
      }

      try {
        if (typeof dataSentCallback === 'function') {
          dataSentCallback();
        }
      } catch (err) {
        // Игнорируем проблемы внешнего кода.
      }

      // Получение подписей
      try {
        let response;

        for (let i = 0; i < this.retries; i += 1) {
          try {
            response = await fetch( // eslint-disable-line no-await-in-loop
              this.signURL,
              {
                cache: 'no-store',
              },
            );

            // Будем пытаться отправлять запросы до тех пор, пока не получим ответа.
            break;
          } catch (err) {
            // Игнорируем исключение и пробуем снова.
          }
        }

        if (!response) {
          throw new Error(`Не удалось получить ответа от сервера ${this.signURL}.`);
        }

        if (!response.ok) {
          throw new Error(`Сервер вернул статус '${response.status}: ${response.statusText}'`);
        }

        const responseJson = await response.json();

        if (responseJson.message) {
          throw new Error(responseJson.message);
        }

        const signatures = responseJson.documentsToSign.map(
          (documentToSign) => documentToSign.document.file.data,
        );

        return signatures;
      } catch (err) {
        throw new QRSigningError('Не удалось получить подписи.', err);
      }
    }

    static arrayBufferToB64(arrayBuffer) {
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  }

  exports.QRSigningClientCMS = QRSigningClientCMS; // eslint-disable-line no-param-reassign
})(
  typeof exports === 'undefined' ? this : exports,
  typeof window === 'undefined' ? { btoa(x) { return x; } } : window,
); // Заглушка для NodeJS
