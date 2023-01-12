# sigex-qr-signing-client

Клиент для работы с API сервиса SIGEX для подписания электронных документов ЭЦП через QR с помощью eGov mobile (aka **QR подписание**).

Разработан для веб интерфейса [https://sigex.kz](https://sigex.kz).

Документация по API: [API.md](API.md).

Пример: https://sigex-kz.github.io/sigex-qr-signing-client/

Библиотека использует следующие вызовы API сервиса SIGEX:
- [`POST /api/egovQr - зарегистрировать новую процедуру подписания ЭЦП через QR`](https://sigex.kz/support/developers/#egov-qr)
- [`POST /api/egovQr/{qrId} - отправка данных на подписание`](https://sigex.kz/support/developers/#egov-qr-send-data)
- [`GET /api/egovQr/{qrId} - получение подписей`](https://sigex.kz/support/developers/#egov-qr-get-signatures)

Описание работы API подписания через QR, реализованного в SIGEX, приведено в статье https://sigex.kz/blog/2022-12-14-signing-via-qr/

## Использование

Одним из следующих образов:
- скопировать себе `sigex-qr-signing-client.js` и загрузить его на странице;
- `npm install sigex-qr-signing-client`.

## Пример использования

```js
async qrSign() {
  try {
    const qrSigner = new QRSigningClientCMS('Запрос на подписание');
    qrSigner.addDataToSign('Данные на подпись', 'MTEK', [], false);
    const qrCode = await qrSigner.registerQRSinging();
    const qrCodeDataString = `data:image/gif;base64,${qrCode}`;

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
