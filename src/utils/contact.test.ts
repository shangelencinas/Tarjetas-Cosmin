import test from 'node:test';
import assert from 'node:assert/strict';
import { createVCardString } from './vcard';
import { validateLeadForm, buildWhatsAppLink, buildLeadWhatsAppMessage, buildLeadEmailLink } from './lead';
import { generateElementorHtml, generateWordPressPluginPhp } from './wordpress';
import { ContactInfo, LeadFormData } from '../types';

const mockContact: ContactInfo = {
  name: 'Gloria Denisse Valencia Bourjac',
  firstName: 'Gloria Denisse',
  lastName: 'Valencia Bourjac',
  role: 'Especialista en Minería y Concesiones / Desarrollo de Proyectos',
  company: 'COSMIN - Consultoría y Servicios Mineros',
  tagline: 'Conectando valor geológico, gestión de concesiones y alianzas mineras.',
  phone: '+526621485479',
  phoneFormatted: '+52 (662) 148-5479',
  email: 'Geovalencia90@gmail.com',
  location: 'Hermosillo, Sonora, México',
  websiteCosmin: 'https://www.cosmin.com.mx/',
  websiteCoslink: 'https://www.coslink.global',
  socialCosmin: {
    handle: '@cosminmx',
    instagram: 'https://instagram.com/cosminmx',
    linkedin: 'https://linkedin.com/company/cosminmx',
    facebook: 'https://facebook.com/cosminmx',
    x: 'https://x.com/cosminmx',
  },
  socialCoslink: {
    handle: '@coslink.global',
    instagram: 'https://instagram.com/coslink.global',
    linkedin: 'https://linkedin.com/company/coslink-global',
    website: 'https://www.coslink.global',
  },
  photoUrl: '/assets/aistudio/image_9a80a122.png',
  cosminLogoTransparent: '/assets/aistudio/cosmin_logo_transparent.png',
  cosminLogoWhiteText: '/assets/aistudio/cosmin_logo_white_text.png',
  coslinkLogoTransparent: '/assets/aistudio/coslink_logo_transparent.png',
  coslinkLogoWhite: '/assets/aistudio/coslink_logo_white_transparent.png',
};

test('vCard string contains proper standard fields and Gloria contact data', () => {
  const vcard = createVCardString(mockContact);
  assert.ok(vcard.includes('BEGIN:VCARD'));
  assert.ok(vcard.includes('VERSION:3.0'));
  assert.ok(vcard.includes('FN:Gloria Denisse Valencia Bourjac'));
  assert.ok(vcard.includes('TEL;TYPE=CELL,VOICE:+526621485479'));
  assert.ok(vcard.includes('EMAIL;TYPE=PREF,INTERNET:Geovalencia90@gmail.com'));
  assert.ok(vcard.includes('URL;TYPE=WORK:https://www.cosmin.com.mx/'));
  assert.ok(vcard.includes('URL;TYPE=COSLINK:https://www.coslink.global'));
  assert.ok(vcard.includes('END:VCARD'));
});

test('Lead form validation fails when required fields are missing or invalid', () => {
  const invalidData: LeadFormData = {
    name: '',
    company: '',
    phone: '123',
    email: 'not-an-email',
    projectType: '',
    message: '',
  };

  const result = validateLeadForm(invalidData);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.email);
  assert.ok(result.errors.projectType);
  assert.ok(result.errors.message);
});

test('Lead form validation passes with valid contact data', () => {
  const validData: LeadFormData = {
    name: 'Carlos Mendoza',
    company: 'Minerales del Noroeste',
    phone: '6622105500',
    email: 'carlos@minerales.mx',
    projectType: 'Evaluación de Concesión',
    message: 'Buscamos asesoría para exploración geológica en Sonora.',
  };

  const result = validateLeadForm(validData);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('WhatsApp links are constructed properly with encoded text', () => {
  const link = buildWhatsAppLink('6621485479', 'Hola Gloria');
  assert.ok(link.startsWith('https://wa.me/526621485479'));
  assert.ok(link.includes(encodeURIComponent('Hola Gloria')));
});

test('WhatsApp lead message formats all lead fields', () => {
  const data: LeadFormData = {
    name: 'Ana Beltrán',
    company: 'Inversiones Mineras SA',
    phone: '6629998877',
    email: 'ana@inversiones.com',
    projectType: 'Inversión en Proyectos',
    message: 'Interesados en conocer oportunidades en COSLINK.',
  };

  const message = buildLeadWhatsAppMessage(data);
  assert.ok(message.includes('Ana Beltrán'));
  assert.ok(message.includes('Inversiones Mineras SA'));
  assert.ok(message.includes('Inversión en Proyectos'));
  assert.ok(message.includes('https://www.cosmin.com.mx/'));
});

test('Email mailto link builds proper subject and body', () => {
  const data: LeadFormData = {
    name: 'Pedro Ramos',
    company: 'Geofísica Aplicada',
    phone: '6625551234',
    email: 'pedro@geofisica.com',
    projectType: 'Proveeduría Minera',
    message: 'Ofrecemos servicios de magnetometría.',
  };

  const mailto = buildLeadEmailLink('Geovalencia90@gmail.com', data);
  assert.ok(mailto.startsWith('mailto:Geovalencia90@gmail.com'));
  assert.ok(mailto.includes(encodeURIComponent('Proveeduría Minera')));
});

test('WordPress and Elementor snippets generate valid code', () => {
  const appUrl = 'https://www.cosmin.com.mx/gloria';
  const elementorHtml = generateElementorHtml(appUrl);
  assert.ok(elementorHtml.includes('<iframe'));
  assert.ok(elementorHtml.includes(appUrl));

  const wpPlugin = generateWordPressPluginPhp(appUrl);
  assert.ok(wpPlugin.includes('Plugin Name:'));
  assert.ok(wpPlugin.includes('add_shortcode'));
});
