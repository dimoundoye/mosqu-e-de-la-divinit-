// src/pages/PaiementDon.jsx
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import QRCode from 'qrcode'
import { Building2, Smartphone, Copy, Check, ExternalLink, X, CheckCircle2, PhoneCall } from 'lucide-react'
import { chargerRenovation, urlMedia } from '../service/api'
import LineReveal from '../components/ui/LineReveal'
import Pattern from '../components/ui/Pattern'
import Reveal from '../components/ui/Reveal'
import { cx } from '../utils/helpers'
import { ease } from '../lib/motion'
import s from './PaiementDon.module.css'

export default function PaiementDon() {
  const [activeTab, setActiveTab] = useState('mobile') // 'mobile' | 'virement'
  const [operator, setOperator] = useState('wave') // 'wave' | 'om'

  // Logos des opérateurs : gérés au dashboard, comme ceux de la page
  // rénovation. Une seule source pour les deux écrans, sinon les visuels
  // finissent par diverger.
  const [logos, setLogos] = useState({ wave: null, om: null })

  useEffect(() => {
    let annule = false
    chargerRenovation()
      .then((donnees) => {
        if (annule) return
        const moyens = donnees?.moyensPaiement || []
        const trouver = (motif) => moyens.find((m) => new RegExp(motif, 'i').test(m.nom))?.logo || null
        setLogos({ wave: urlMedia(trouver('wave')), om: urlMedia(trouver('orange')) })
      })
      .catch(() => {
        // Repli sur les pastilles lettrées : la page de don doit rester
        // utilisable même si les visuels sont injoignables.
      })
    return () => {
      annule = true
    }
  }, [])
  const [selectedAmount, setSelectedAmount] = useState(15000)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [copiedKey, setCopiedKey] = useState(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)

  // VOS COORDONNÉES OFFICIELLES
  const WAVE_PHONE = '+221 77 820 19 92'
  const WAVE_PAYMENT_BASE = 'https://pay.wave.com/m/M_mosquee_divinite_dakar'
  const OM_MERCHANT_CODE = '854 219'

  const BANK_INFO = {
    bankName: "Banque de l'Habitat du Sénégal (BHS)",
    agency: 'Agence Almadies - Ouakam (Dakar)',
    accountHolder: 'Comité de Sauvegarde de la Mosquée de la Divinité',
    codeBanque: 'SN012',
    codeGuichet: '01234',
    numCompte: '012345678901',
    cleRib: '45',
    ribComplet: 'SN012 01234 012345678901 45',
    iban: 'SN54 SN01 2012 3401 2345 6789 0145',
    bicSwift: 'BHSNSNDAXXX',
    referenceConseillee: 'DON-RENOVATION-DIVINITE',
  }

  const currentAmount =
    selectedAmount === 'custom' ? (Number(customAmount) > 0 ? Number(customAmount) : 10000) : selectedAmount

  // Génération dynamique du QR Code
  useEffect(() => {
    const payload =
      operator === 'wave'
        ? `${WAVE_PAYMENT_BASE}?amount=${currentAmount}&memo=Don-Divinite`
        : `OM:merchant=${OM_MERCHANT_CODE};amount=${currentAmount};recipient=${WAVE_PHONE}`

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 1.5,
      color: {
        dark: operator === 'wave' ? '#003b46' : '#2b1404',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err))
  }, [operator, currentAmount])

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2500)
    }
  }

  const handleOpenWaveLink = () => {
    window.open(`${WAVE_PAYMENT_BASE}?amount=${currentAmount}`, '_blank')
  }

  const handleOpenOmLink = () => {
    const ussdString = `*144*391*${OM_MERCHANT_CODE.replace(/\s/g, '')}*${currentAmount}#`
    window.location.href = `tel:${encodeURIComponent(ussdString)}`
  }

  // Bouton « Copier » réutilisé dans le RIB
  const copyButton = (value, id) => (
    <button type="button" onClick={() => copyToClipboard(value, id)} className={s.copy}>
      {copiedKey === id ? (
        <>
          <Check size={13} aria-hidden="true" /> Copié
        </>
      ) : (
        <>
          <Copy size={13} aria-hidden="true" /> Copier
        </>
      )}
    </button>
  )

  const brand = (op, small = false) => (
    <span
      className={cx(
        s.brand,
        small && s.brandSmall,
        op === 'wave' ? s.brandWave : s.brandOrange,
        logos[op] && s.brandImage,
      )}
      aria-hidden="true"
    >
      {logos[op] ? <img src={logos[op]} alt="" /> : op === 'wave' ? 'W' : 'OM'}
    </span>
  )

  return (
    <div className={s.page}>
      {/* ---------- EN-TÊTE ---------- */}
      <header className={cx(s.header, 'on-dark')}>
        <Pattern className={s.headerPattern} />
        <div className={`container ${s.headerInner}`}>
          <LineReveal as="h1" onMount className={s.title}>
            <span>Paiements &amp; Dons Officiels</span>
          </LineReveal>
          <Reveal as="p" className={s.lead} delay={0.25}>
            Chaque contribution par Mobile Money ou Virement Bancaire finance directement les travaux de sécurisation et de
            rénovation de la Mosquée de la Divinité.
          </Reveal>
        </div>
      </header>

      <div className={`container ${s.body}`}>
        {/* Onglets Mobile Money / Virement */}
        <Reveal className={s.tabs} role="tablist" y={20}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mobile'}
            onClick={() => setActiveTab('mobile')}
            className={cx(s.tab, activeTab === 'mobile' && s.tabActive)}
          >
            <Smartphone size={17} aria-hidden="true" />
            <span>Mobile Money</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'virement'}
            onClick={() => setActiveTab('virement')}
            className={cx(s.tab, activeTab === 'virement' && s.tabActive)}
          >
            <Building2 size={17} aria-hidden="true" />
            <span>Virement Bancaire (RIB)</span>
          </button>
        </Reveal>

        <AnimatePresence mode="wait">
          {/* CONTENU ONGLET 1 : MOBILE MONEY */}
          {activeTab === 'mobile' && (
            <motion.div
              key="mobile"
              className={s.mobileLayout}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ease.out }}
            >
              {/* Formulaire de don */}
              <div className={s.formCard}>
                {/* Opérateur */}
                <div className={s.step}>
                  <p className={s.stepLabel}>
                    <span className={s.stepNum}>1</span> Opérateur de paiement
                  </p>
                  <div className={s.operators}>
                    <button
                      type="button"
                      onClick={() => setOperator('wave')}
                      className={cx(s.operator, operator === 'wave' && s.operatorActive)}
                      aria-pressed={operator === 'wave'}
                    >
                      {brand('wave')}
                      <span className={cx(s.operatorName, s.nameWave)}>Wave Sénégal</span>
                      <span className={s.operatorDesc}>Lien direct &amp; QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOperator('om')}
                      className={cx(s.operator, operator === 'om' && s.operatorActive)}
                      aria-pressed={operator === 'om'}
                    >
                      {brand('om')}
                      <span className={cx(s.operatorName, s.nameOrange)}>Orange Money</span>
                      <span className={s.operatorDesc}>Code marchand &amp; USSD</span>
                    </button>
                  </div>
                </div>

                {/* Montant */}
                <div className={s.step}>
                  <div className={s.stepHead}>
                    <p className={s.stepLabel}>
                      <span className={s.stepNum}>2</span> Montant du don
                    </p>
                    <span className={s.currentAmount}>{currentAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>

                  <div className={s.amounts}>
                    {[2000, 5000, 10000, 15000, 25000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedAmount(amt)}
                        className={cx(s.amount, selectedAmount === amt && s.amountActive)}
                        aria-pressed={selectedAmount === amt}
                      >
                        {amt.toLocaleString('fr-FR')} F
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAmount('custom')}
                      className={cx(s.amount, selectedAmount === 'custom' && s.amountActive)}
                      aria-pressed={selectedAmount === 'custom'}
                    >
                      Autre montant
                    </button>
                  </div>

                  {selectedAmount === 'custom' && (
                    <div className={s.customWrap}>
                      <input
                        type="number"
                        min="500"
                        step="500"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Entrez le montant en FCFA"
                        aria-label="Entrez le montant en FCFA"
                        className={s.input}
                      />
                      <span className={s.customSuffix}>FCFA</span>
                    </div>
                  )}
                </div>

                {/* Coordonnées donateur (optionnel) */}
                <div className={cx(s.step, s.stepLast)}>
                  <p className={s.stepLabel}>
                    <span className={s.stepNum}>3</span> Vos informations (facultatif - pour l'attestation de don)
                  </p>
                  <div className={s.grid2}>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Nom ou Famille"
                      aria-label="Nom ou Famille"
                      className={s.input}
                    />
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="N° Mobile (+221 ...)"
                      aria-label="N° Mobile (+221 ...)"
                      className={cx(s.input, s.mono)}
                    />
                  </div>
                </div>
              </div>

              {/* QR Code & Action directe */}
              <div className={s.side}>
                <div className={cx(s.payCard, 'on-dark')}>
                  <div className={s.payHead}>
                    <h2 className={s.payBrand}>
                      {brand(operator, true)}
                      <span>{operator === 'wave' ? 'Wave Sénégal' : 'Orange Money'}</span>
                    </h2>
                    <span className={s.payAmount}>{currentAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>

                  {/* QR Code */}
                  <div className={s.qrBox}>
                    <div className={s.qr}>
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code Paiement" />
                      ) : (
                        <div className={s.qrPlaceholder} />
                      )}
                    </div>
                    <p>Scannez avec l'application {operator === 'wave' ? 'Wave' : 'Orange Money'}</p>
                  </div>

                  {/* Bouton d'action direct */}
                  {operator === 'wave' ? (
                    <button type="button" onClick={handleOpenWaveLink} className={cx(s.payAction, s.payWave)}>
                      <ExternalLink size={16} aria-hidden="true" /> Ouvrir l'application Wave
                    </button>
                  ) : (
                    <button type="button" onClick={handleOpenOmLink} className={cx(s.payAction, s.payOm)}>
                      <Smartphone size={16} aria-hidden="true" /> Valider par USSD (*144#)
                    </button>
                  )}

                  {/* Numéro et code marchand à copier */}
                  <div className={s.merchant}>
                    <div>
                      <span className={s.merchantLabel}>
                        {operator === 'wave' ? 'Numéro Marchand Wave' : 'Code Marchand OM'}
                      </span>
                      <span className={s.merchantValue}>{operator === 'wave' ? WAVE_PHONE : OM_MERCHANT_CODE}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(operator === 'wave' ? WAVE_PHONE : OM_MERCHANT_CODE, 'code')}
                      className={cx(s.copy, s.copyLight)}
                    >
                      {copiedKey === 'code' ? (
                        <>
                          <Check size={13} aria-hidden="true" /> Copié
                        </>
                      ) : (
                        <>
                          <Copy size={13} aria-hidden="true" /> Copier
                        </>
                      )}
                    </button>
                  </div>

                  {/* Confirmation reçu */}
                  <button type="button" onClick={() => setReceiptModalOpen(true)} className={s.receipt}>
                    <CheckCircle2 size={15} aria-hidden="true" />
                    J'ai effectué mon transfert · Mon attestation
                  </button>
                </div>

                {/* Assistance WhatsApp */}
                <div className={s.help}>
                  <div>
                    <span className={s.helpTitle}>Besoin d'aide ou confirmation ?</span>
                    <span className={s.helpText}>Trésorerie WhatsApp : +221 77 820 19 92</span>
                  </div>
                  <a
                    href={`https://wa.me/221778201992?text=${encodeURIComponent(`Bonjour, je souhaite des renseignements pour faire un don de ${currentAmount} FCFA pour la Mosquée de la Divinité.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.whatsapp}
                  >
                    <PhoneCall size={13} aria-hidden="true" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* CONTENU ONGLET 2 : VIREMENT BANCAIRE (RIB) */}
          {activeTab === 'virement' && (
            <motion.div
              key="virement"
              className={s.bankPanel}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ease.out }}
            >
              <div className={s.bankHead}>
                <div>
                  <div className={s.bankBrand} aria-label="Compte PAMECAS">
                    <span className={s.pamecas}>pamecas</span>
                    <span className={s.pamecasTag}>Partenaire bancaire</span>
                  </div>
                  <h2 className={s.bankTitle}>Coordonnées pour Virement Bancaire</h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const allRib = `BANQUE : ${BANK_INFO.bankName}
TITULAIRE : ${BANK_INFO.accountHolder}
RIB : ${BANK_INFO.ribComplet}
IBAN : ${BANK_INFO.iban}
BIC / SWIFT : ${BANK_INFO.bicSwift}
LIBELLÉ : ${BANK_INFO.referenceConseillee}`
                    copyToClipboard(allRib, 'all')
                  }}
                  className={s.copyAll}
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check size={15} aria-hidden="true" /> Tout est copié !
                    </>
                  ) : (
                    <>
                      <Copy size={15} aria-hidden="true" /> Copier tout le RIB
                    </>
                  )}
                </button>
              </div>

              {/* Grille des coordonnées */}
              <div className={s.bankGrid}>
                {/* Titulaire */}
                <div className={s.bankField}>
                  <span className={s.fieldLabel}>Bénéficiaire / Titulaire</span>
                  <p className={s.fieldStrong}>{BANK_INFO.accountHolder}</p>
                  <p className={s.fieldMuted}>Mosquée de la Divinité · Ouakam, Dakar</p>
                </div>

                {/* Banque */}
                <div className={s.bankField}>
                  <span className={s.fieldLabel}>Banque &amp; Agence</span>
                  <p className={s.fieldStrong}>{BANK_INFO.bankName}</p>
                  <p className={s.fieldMuted}>{BANK_INFO.agency}</p>
                </div>

                {/* RIB National UEMOA */}
                <div className={s.bankField}>
                  <div className={s.fieldHead}>
                    <span className={s.fieldLabel}>RIB National (Sénégal / UEMOA)</span>
                    {copyButton(BANK_INFO.ribComplet, 'rib')}
                  </div>
                  <div className={s.ribBlocks}>
                    <div>
                      <span>Banque</span>
                      {BANK_INFO.codeBanque}
                    </div>
                    <div>
                      <span>Guichet</span>
                      {BANK_INFO.codeGuichet}
                    </div>
                    <div>
                      <span>Compte</span>
                      {BANK_INFO.numCompte}
                    </div>
                    <div className={s.ribKey}>
                      <span>Clé</span>
                      {BANK_INFO.cleRib}
                    </div>
                  </div>
                </div>

                {/* IBAN International */}
                <div className={s.bankField}>
                  <div className={s.fieldHead}>
                    <span className={s.fieldLabel}>IBAN (International &amp; Diaspora)</span>
                    {copyButton(BANK_INFO.iban.replace(/\s/g, ''), 'iban')}
                  </div>
                  <p className={s.iban}>{BANK_INFO.iban}</p>
                </div>

                {/* SWIFT / BIC */}
                <div className={cx(s.bankField, s.bankRow)}>
                  <div>
                    <span className={s.fieldLabel}>Code BIC / SWIFT</span>
                    <span className={s.bic}>{BANK_INFO.bicSwift}</span>
                  </div>
                  {copyButton(BANK_INFO.bicSwift, 'bic')}
                </div>

                {/* Référence / Libellé */}
                <div className={cx(s.bankField, s.bankRow)}>
                  <div>
                    <span className={s.fieldLabel}>Motif conseillé</span>
                    <span className={s.reference}>{BANK_INFO.referenceConseillee}</span>
                  </div>
                  {copyButton(BANK_INFO.referenceConseillee, 'ref')}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Reçu de confirmation */}
      <AnimatePresence>
        {receiptModalOpen && (
          <motion.div
            className={s.modalOverlay}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setReceiptModalOpen(false)
            }}
          >
            <motion.div
              className={s.modal}
              role="dialog"
              aria-modal="true"
              aria-label="Attestation de Don Enregistrée"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45, ease: ease.out }}
            >
              <div className={s.modalHead}>
                <h3>Attestation de Don Enregistrée</h3>
                <button type="button" onClick={() => setReceiptModalOpen(false)} className={s.modalClose} aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>
              <p className={s.modalText}>
                Merci à <strong>{donorName || 'Fidèle Donateur'}</strong> pour votre contribution de{' '}
                <strong className={s.modalAmount}>{currentAmount.toLocaleString('fr-FR')} FCFA</strong>.
              </p>
              <p className={s.modalNote}>
                Qu'Allah bénisse votre geste pour la restauration et la pérennité de la Mosquée de la Divinité.
              </p>
              <button type="button" onClick={() => setReceiptModalOpen(false)} className={s.modalButton}>
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
