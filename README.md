# sigex-qr-signing-client

Клиент для работы с API сервиса SIGEX для подписания электронных документов ЭЦП через QR с помощью eGov mobile (aka **QR подписание**).

Разработан для веб интерфейса [https://sigex.kz](https://sigex.kz).

Документация по API: [https://sigex-kz.github.io/sigex-qr-signing-client/api/](https://sigex-kz.github.io/sigex-qr-signing-client/api/).

Пример: [https://sigex-kz.github.io/sigex-qr-signing-client/](https://sigex-kz.github.io/sigex-qr-signing-client/).
Пример подписания нескольких документов: [https://sigex-kz.github.io/sigex-qr-signing-client/multi.html](https://sigex-kz.github.io/sigex-qr-signing-client/multi.html).

Библиотека использует следующие вызовы API сервиса SIGEX:
- [`POST /api/egovQr - зарегистрировать новую процедуру подписания ЭЦП через QR`](https://sigex.kz/support/developers/#egov-qr)
- [`POST /api/egovQr/{qrId} - отправка данных на подписание`](https://sigex.kz/support/developers/#egov-qr-send-data)
- [`GET /api/egovQr/{qrId} - получение подписей`](https://sigex.kz/support/developers/#egov-qr-get-signatures)

Описание работы API подписания через QR, реализованного в SIGEX, приведено в статье https://sigex.kz/blog/2022-12-14-signing-via-qr/

**Внимание:** начиная с версии v0.3.0 метод `addDataToSign` стал асинхронным.

## Использование

Одним из следующих образов:
- скопировать себе `sigex-qr-signing-client.js` и загрузить его на странице;
- `npm install sigex-qr-signing-client`.

## Пример использования

```js
async qrSign() {
  try {
    // Данные на подпись закодированные в base64
    const dataToSignBase64 = 'MTEK';

    const qrSigner = new QRSigningClientCMS('Запрос на подписание');
    await qrSigner.addDataToSign(['Данные на подпись'], dataToSignBase64, [], false);
    const qrCode = await qrSigner.registerQRSinging();

    // Полученное изображение можно отобразить пользователю чтобы он считал его с помощью
    // приложения eGov mobile на своем мобильном телефоне. То есть участвуют два устройства:
    // - на первом устройстве (ПК или ноутбук) отображается QR код;
    // - на втором (мобильный телефон) пользователь открывает eGov mobile и сканирует QR код.
    const qrCodeDataString = `data:image/gif;base64,${qrCode}`;

    // Эти ссылки можно отобразить на мобильном устройстве в том случае, если предполагается
    // использовать только одно устройство (мобильный телефон), на котором установлен eGov mobile
    // или eGov Business (кросс подписание).
    // Когда пользователь кликнет по ссылке, откроется соответствующее приложение с запущенной
    // процедурой подписания.
    const eGovMobileLaunchLink = qrSigner.getEGovMobileLaunchLink();
    const eGovBusinessLaunchLink = qrSigner.getEGovBusinessLaunchLink();

    const signatures = await qrSigner.getSignatures();
    return signature[0];
  } catch (err) {
    console.log(err);
    console.log(err.details);
    return;
  }
}
```

## Разработка

- `npm run lint` - проверка кода с помощью ESLint;
- `npm run test` - выполнение тестов;
- `npm run ts-check` - проверка с помощью TypeScript;
- `npm run build-docs` - обновление документации из комментариев в коде;
- `npm run build` - все вышеперечисленное вместе, **рекомендуется выполнять перед коммитом**;
- `npm run test-data-builder` - запуск веб сервера на http://127.0.0.1:8080 со страницей подготовки данных для тестов.

### Подготовка данных для тестов

- запустить сервер публикующий страницу подготовки данных `npm run test-data-builder`;
- открыть [http://127.0.0.1:8080](http://127.0.0.1:8080);
- выполнить инструкции;
- проверить сформированные данные (в основном корректность формирования подписей);
- замаскировать в сформированных данных чувствительную информацию (подписи и сертификаты);
- записать сформированный блок данных в *test/test-data.json*.
