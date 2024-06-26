new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    description: 'Тестовое подписание',
    name: 'Блок данных на подпись',
    dataB64: 'MTEK',
    dataFile: '',
    isPDF: false,
    attachData: false,
    qrCodeImage: null,
    eGovMobileLaunchLink: '',
    eGovBusinessLaunchLink: '',
    signature: null,
    waiting: false,
    debugLog: '',
  },

  methods: {
    async sign() {
      this.signature = null;
      this.waiting = true;

      try {
        let dataB64ToSend = this.dataB64;
        if (this.dataFile) {
          dataB64ToSend = await (new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(this.$refs.fileUploadInput.files[0]);
          }));

          dataB64ToSend = dataB64ToSend.split(',')[1];
        }

        const qrSigner = new QRSigningClientCMS(this.description, this.attachData);
        qrSigner.addDataToSign([this.name], dataB64ToSend, [], this.isPDF);
        const qrCode = await qrSigner.registerQRSinging();
        this.qrCodeImage = `data:image/gif;base64,${qrCode}`;
        this.eGovMobileLaunchLink = qrSigner.getEGovMobileLaunchLink();
        this.eGovBusinessLaunchLink = qrSigner.getEGovBusinessLaunchLink();
        [this.signature] = await qrSigner.getSignatures(
          () => {
            this.qrCodeImage = null;
          },
          (err) => {
            this.debugLog += (err.message + '\n');
          },
        );
        this.waiting = false;
      } catch (err) {
        this.waiting = false;
        alert(`${err}: ${err.details}`);
      }
    },
  },
});
