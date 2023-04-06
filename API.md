## Classes

<dl>
<dt><a href="#QRSigningError">QRSigningError</a></dt>
<dd><p>Класс ошибок QRSigningError.</p>
</dd>
<dt><a href="#QRSigningClientCMS">QRSigningClientCMS</a></dt>
<dd><p>Класс клиента подписания через QR для произвольных данных (формирует CMS подписи).</p>
</dd>
</dl>

<a name="QRSigningError"></a>

## QRSigningError
Класс ошибок QRSigningError.

**Kind**: global class  
<a name="QRSigningClientCMS"></a>

## QRSigningClientCMS
Класс клиента подписания через QR для произвольных данных (формирует CMS подписи).

**Kind**: global class  

* [QRSigningClientCMS](#QRSigningClientCMS)
    * [new QRSigningClientCMS(description, [attach], [baseUrl])](#new_QRSigningClientCMS_new)
    * [.addDataToSign(names, data, [meta], [isPDF])](#QRSigningClientCMS+addDataToSign)
    * [.registerQRSinging()](#QRSigningClientCMS+registerQRSinging) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.getQR()](#QRSigningClientCMS+getQR) ⇒ <code>String</code>
    * [.getEGovMobileLaunchLink()](#QRSigningClientCMS+getEGovMobileLaunchLink) ⇒ <code>String</code>
    * [.getEGovBusinessLaunchLink()](#QRSigningClientCMS+getEGovBusinessLaunchLink) ⇒ <code>String</code>
    * [.getSignatures([dataSentCallback])](#QRSigningClientCMS+getSignatures) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>

<a name="new_QRSigningClientCMS_new"></a>

### new QRSigningClientCMS(description, [attach], [baseUrl])
Конструктор.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| description | <code>String</code> |  | описание подписываемых данных. |
| [attach] | <code>Boolean</code> | <code>false</code> | следует ли включить в подпись подписываемые данные. |
| [baseUrl] | <code>String</code> | <code>&#x27;https://sigex.kz&#x27;</code> | базовый URL сервиса SIGEX. |

<a name="QRSigningClientCMS+addDataToSign"></a>

### qrSigningClientCMS.addDataToSign(names, data, [meta], [isPDF])
Добавить блок данных для подписания, зачастую речь идет о файле.

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Throws**:

- QRSigningError


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| names | <code>Array.&lt;String&gt;</code> |  | массив имен подписываемого блока данных на разных языках [ru, kk, en]. Массив должен сожердать как минимум одну строку, в этом случае она будет использоваться для всех языков. |
| data | <code>String</code> \| <code>ArrayBuffer</code> |  | данные, которые нужно подписать, в виде строки Base64 либо ArrayBuffer. |
| [meta] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | опциональный массив объектов метаданных, содержащих поля `"name"` и `"value"` со строковыми значениями. |
| [isPDF] | <code>Boolean</code> | <code>false</code> | опциональная подсказка для приложения eGov mobile помогающая ему лучше подобрать приложение для отображения данных перед подписанием. |

<a name="QRSigningClientCMS+registerQRSinging"></a>

### *(async)* qrSigningClientCMS.registerQRSinging() ⇒ <code>Promise.&lt;String&gt;</code>
Зарегистрировать процедуру QR подписания.

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Returns**: <code>Promise.&lt;String&gt;</code> - изображение QR кода в Base64 кодировке.  
**Throws**:

- QRSigningError

<a name="QRSigningClientCMS+getQR"></a>

### qrSigningClientCMS.getQR() ⇒ <code>String</code>
Получить QR код (необходимо предварительно выполнить регистрацию).

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Returns**: <code>String</code> - изображение QR кода в Base64 кодировке.  
<a name="QRSigningClientCMS+getEGovMobileLaunchLink"></a>

### qrSigningClientCMS.getEGovMobileLaunchLink() ⇒ <code>String</code>
Получить ссылку для запуска процедуры подписания в eGov mobile (кросс подписание)
- для тех случаев, когда нужно выполнять подписание на том же самом устройстве, без
необходимости сканировать QR код (необходимо предварительно выполнить регистрацию).

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Returns**: <code>String</code> - ссылка для запуска процедуры подписания в eGov mobile.  
<a name="QRSigningClientCMS+getEGovBusinessLaunchLink"></a>

### qrSigningClientCMS.getEGovBusinessLaunchLink() ⇒ <code>String</code>
Получить ссылку для запуска процедуры подписания в eGov Business (кросс подписание)
- для тех случаев, когда нужно выполнять подписание на том же самом устройстве, без
необходимости сканировать QR код (необходимо предварительно выполнить регистрацию).

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Returns**: <code>String</code> - ссылка для запуска процедуры подписания в eGov Business.  
<a name="QRSigningClientCMS+getSignatures"></a>

### *(async)* qrSigningClientCMS.getSignatures([dataSentCallback]) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Получить подписи под данными. Это может занять много времени, так как в
процессе выполнения данные будут отправлены в eGov mobile, далее нужно
будет дождаться пока пользователь подпишет данные и подписи будут выкачены
обратно.

**Kind**: instance method of [<code>QRSigningClientCMS</code>](#QRSigningClientCMS)  
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - массив подписей под зарегистрированными блоками данных.  
**Throws**:

- QRSigningError


| Param | Type | Description |
| --- | --- | --- |
| [dataSentCallback] | <code>function</code> | опциональная функция, которая будет вызвана после того, как данные для подписания будут переданы на сервер. Может быть использована для того, чтобы перестать отображать QR код, так как он больше не действителен. |

