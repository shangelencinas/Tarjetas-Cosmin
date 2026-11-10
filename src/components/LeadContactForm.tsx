import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { ContactInfo, LeadFormData } from '../types';
import { 
  validateLeadForm, 
  ValidationErrors, 
  buildWhatsAppLink, 
  buildLeadWhatsAppMessage, 
  buildLeadEmailLink 
} from '../utils/lead';

interface LeadContactFormProps {
  contact: ContactInfo;
}

export function LeadContactForm({ contact }: LeadContactFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    projectType: 'Evaluación / Tramitación de Concesión Minera (COSMIN)',
    message: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<LeadFormData | null>(null);

  const projectOptions = [
    'Evaluación / Tramitación de Concesión Minera (COSMIN)',
    'Inversión en Exploración o Mina (COSLINK)',
    'Promoción de Concesión en Plataforma COSLINK',
    'Proveeduría de Equipos / Barrenación / Laboratorio',
    'Consultoría Geológica y Dictamen Técnico',
    'Cumplimiento Ambiental y MIA',
    'Otra Consulta Minera',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#f59e0b', '#0f172a'],
      });
    } catch {
      // safe fallback
    }

    const submittedCopy = { ...formData };
    setLastSubmittedData(submittedCopy);
    setIsSubmitted(true);

    // Build WhatsApp URL with the form responses and open directly
    const waMessage = buildLeadWhatsAppMessage(submittedCopy);
    const waUrl = buildWhatsAppLink(contact.phone, waMessage);

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Auto-open WhatsApp blocked or not supported:', err);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      projectType: 'Evaluación / Tramitación de Concesión Minera (COSMIN)',
      message: '',
    });
    setErrors({});
  };

  return (
    <section id="contacto" className="py-12 border-t border-slate-200/70 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title: Pure COSMIN Brand */}
        <div className="text-center sm:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/20">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Contacto Directo por WhatsApp · COSMIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Iniciemos una Conversación sobre tu Proyecto
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Cuéntanos sobre tus concesiones, necesidades de exploración o requerimientos mineros. Las respuestas se enviarán directamente al WhatsApp de Gloria Valencia ({contact.phoneFormatted}).
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-10">
          {isSubmitted && lastSubmittedData ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <MessageCircle className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>¡Respuestas listas para enviar por WhatsApp!</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  ¡Muchas gracias, {lastSubmittedData.name}!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Tus respuestas se han estructurado para enviarse de inmediato a <strong className="text-slate-900 dark:text-white font-semibold">Gloria Valencia ({contact.phoneFormatted})</strong> por WhatsApp.
                </p>
              </div>

              {/* Primary Instant WhatsApp Button */}
              <div className="max-w-md mx-auto space-y-2">
                <a
                  href={buildWhatsAppLink(contact.phone, buildLeadWhatsAppMessage(lastSubmittedData))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Abrir WhatsApp y Enviar Respuestas</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ¿No se abrió WhatsApp automáticamente? Presiona el botón verde para abrir la conversación.
                </p>
              </div>

              {/* Response summary preview */}
              <div className="max-w-lg mx-auto text-left rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Resumen de respuestas del formulario:</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    Listo en WhatsApp
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Nombre: </span>
                    {lastSubmittedData.name}
                  </div>
                  {lastSubmittedData.company && (
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Empresa: </span>
                      {lastSubmittedData.company}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Teléfono: </span>
                    {lastSubmittedData.phone}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Correo: </span>
                    {lastSubmittedData.email}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Interés: </span>
                    {lastSubmittedData.projectType}
                  </div>
                  <div className="sm:col-span-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Mensaje:</span>
                    <p className="mt-1 text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 text-xs">
                      "{lastSubmittedData.message}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={buildLeadEmailLink(contact.email, lastSubmittedData)}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar también copia por Correo</span>
                </a>

                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Editar respuestas o enviar otra consulta</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1: Nombre y Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Ing. Roberto Mendoza"
                    className={`w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-company" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Empresa u Organización <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input
                    id="lead-company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Ej. Minera del Norte S.A. de C.V."
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Teléfono y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lead-phone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono Celular / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej. 662 123 4567"
                    className={`w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nombre@empresa.com"
                    className={`w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Tipo de Proyecto / Interés */}
              <div>
                <label htmlFor="lead-projectType" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Proyecto o Interés <span className="text-red-500">*</span>
                </label>
                <select
                  id="lead-projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                >
                  {projectOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.projectType}
                  </p>
                )}
              </div>

              {/* Row 4: Mensaje */}
              <div>
                <label htmlFor="lead-message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mensaje / Descripción del Requerimiento <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="lead-message"
                  name="message"
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe brevemente la concesión, yacimiento, servicio requerido o interés en la plataforma..."
                  className={`w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                    errors.message ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Atención directa en WhatsApp y estricta confidencialidad minera</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-white shrink-0" />
                  <span>Enviar Respuestas</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
