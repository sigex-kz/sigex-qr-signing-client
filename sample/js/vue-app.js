new Vue({ // eslint-disable-line no-new, no-undef
  el: '#app',

  data: {
    description: 'Тестовое подписание',
    name: 'Блок данных на подпись',
    dataB64: 'MTEK',
    isPDF: false,
    attachData: false,
    qrCodeImage: null,
    signature: null,
    waiting: false,
  },

  methods: {
    async sign() {
      this.signature = null;
      this.waiting = true;

      try {
        const qrSigner = new QRSigningClientCMS(this.description);
        qrSigner.addDataToSign([this.name], this.dataB64, [], this.isPDF);
        const qrCode = await qrSigner.registerQRSinging();
        this.qrCodeImage = `data:image/gif;base64,${qrCode}`;
        [this.signature] = await qrSigner.getSignatures(() => {
          this.qrCodeImage = null;
        });
        this.waiting = false;
      } catch (err) {
        this.waiting = false;
        alert(`${err}: ${err.details}`);
      }
    },
  },
});
