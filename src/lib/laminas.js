import { supabase } from './supabase';
import { laminas as fallbackLaminas } from '../data/laminas';

const fromRow = (row) => ({
  id: row.id,
  name: row.name,
  pathology: row.pathology,
  tissue: row.tissue || '',
  stain: row.stain || '',
  magnification: row.magnification || '',
  description: row.description || '',
  pathologyDescription: row.pathology_description || '',
  keyFindings: Array.isArray(row.key_findings) ? row.key_findings : [],
  tags: Array.isArray(row.tags) ? row.tags : [],
  image: row.image_url || '/laminas/placeholder.svg',
  imagePath: row.image_path || ''
});

export async function fetchLaminas() {
  if (!supabase) return fallbackLaminas;
  const { data, error } = await supabase.from('laminas').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function fetchIsAdmin(userId) {
  if (!supabase || !userId) return false;
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data?.role === 'admin';
}

export async function uploadLaminaImage(file) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('laminas').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined
  });
  if (error) throw error;
  const { data } = supabase.storage.from('laminas').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteLaminaImage(path) {
  if (!supabase || !path) return;
  await supabase.storage.from('laminas').remove([path]);
}

export async function createLamina(form, image) {
  if (!supabase) throw new Error('Supabase não configurado.');
  let uploaded = null;
  try {
    if (image) uploaded = await uploadLaminaImage(image);
    const { data, error } = await supabase.from('laminas').insert({
      name: form.name.trim(),
      pathology: form.pathology.trim(),
      tissue: form.tissue.trim(),
      stain: form.stain.trim(),
      magnification: form.magnification.trim(),
      description: form.description.trim(),
      pathology_description: form.pathologyDescription.trim(),
      key_findings: form.keyFindings.filter(Boolean),
      tags: form.tags.filter(Boolean),
      image_url: uploaded?.url || '/laminas/placeholder.svg',
      image_path: uploaded?.path || null
    }).select('*').single();
    if (error) throw error;
    return fromRow(data);
  } catch (error) {
    if (uploaded?.path) await deleteLaminaImage(uploaded.path);
    throw error;
  }
}

export async function updateLamina(id, form, image) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { data: current, error: currentError } = await supabase.from('laminas').select('*').eq('id', id).single();
  if (currentError) throw currentError;
  let uploaded = null;
  try {
    if (image) uploaded = await uploadLaminaImage(image);
    const payload = {
      name: form.name.trim(),
      pathology: form.pathology.trim(),
      tissue: form.tissue.trim(),
      stain: form.stain.trim(),
      magnification: form.magnification.trim(),
      description: form.description.trim(),
      pathology_description: form.pathologyDescription.trim(),
      key_findings: form.keyFindings.filter(Boolean),
      tags: form.tags.filter(Boolean)
    };
    if (uploaded) {
      payload.image_url = uploaded.url;
      payload.image_path = uploaded.path;
    }
    const { data, error } = await supabase.from('laminas').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    if (uploaded?.path && current.image_path) await deleteLaminaImage(current.image_path);
    return fromRow(data);
  } catch (error) {
    if (uploaded?.path) await deleteLaminaImage(uploaded.path);
    throw error;
  }
}

export async function removeLamina(id) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { data: current, error: currentError } = await supabase.from('laminas').select('image_path').eq('id', id).single();
  if (currentError) throw currentError;
  const { error } = await supabase.from('laminas').delete().eq('id', id);
  if (error) throw error;
  if (current.image_path) await deleteLaminaImage(current.image_path);
}
