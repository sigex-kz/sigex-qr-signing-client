new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    description: 'Тестовое подписание',
    name: 'Блок данных на подпись',
    attachData: false,
    dataFiles: [],
    qrCodeImage: null,
    eGovMobileLaunchLink: '',
    eGovBusinessLaunchLink: '',
    signatures: [],
    waiting: false,
    debugLog: '',
  },

  methods: {
    addDataFile() {
      this.dataFiles.push('');
    },

    async sign() {
      this.waiting = true;

      try {
        const qrSigner = new QRSigningClientCMS(this.description, this.attachData);

        for(const fileUploadInput of this.$refs.fileUploadInputs) {
          let dataB64ToSend = await (new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(fileUploadInput.files[0]);
          }));

          qrSigner.addDataToSign(
            [fileUploadInput.files[0].name],
            dataB64ToSend.split(',')[1],
            [],
            fileUploadInput.files[0].name.toLowerCase().endsWith('.pdf'),
          );
        }

        const qrCode = await qrSigner.registerQRSinging();
        this.qrCodeImage = `data:image/gif;base64,${qrCode}`;
        this.eGovMobileLaunchLink = qrSigner.getEGovMobileLaunchLink();
        this.eGovBusinessLaunchLink = qrSigner.getEGovBusinessLaunchLink();
        const signatures = await qrSigner.getSignatures(
          () => {
            this.qrCodeImage = null;
          },
          (err) => {
            this.debugLog += (err.message + '\n');
          },
        );

        for (const signature of signatures) {
          this.signatures.push(signature);
        }

        this.waiting = false;
      } catch (err) {
        this.waiting = false;
        alert(`${err}: ${err.details}`);
      }
    },
  },

  mounted() {
    this.addDataFile();
  },
});
