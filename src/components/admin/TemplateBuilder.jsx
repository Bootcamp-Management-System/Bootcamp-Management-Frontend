import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings2, 
  Save, 
  Eye, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Type,
  AlignLeft,
  Hash,
  ListOrdered
} from 'lucide-react';
import { recruitmentService } from '../../services/recruitmentService';

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: Type },
  { value: 'textarea', label: 'Long Text', icon: AlignLeft },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'dropdown', label: 'Dropdown', icon: ListOrdered },
  { value: 'url', label: 'URL/Link', icon: Settings2 },
];

export const TemplateBuilder = ({ bootcampId, onSave }) => {
  const [activePhase, setActivePhase] = useState('phase1');
  const [template, setTemplate] = useState({
    phase1Fields: [],
    phase2Fields: [],
    waitlistFields: [],
    isPublished: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplate();
  }, [bootcampId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const data = await recruitmentService.getTemplate(bootcampId);
      if (data && data.data) {
        setTemplate(data.data);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Fallback default
        setTemplate({
            phase1Fields: [],
            phase2Fields: [],
            waitlistFields: [],
            isPublished: false
        });
      } else {
        console.error('Failed to fetch template:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    const newField = {
      name: `field_${Date.now()}`,
      label: 'New Question',
      type: 'text',
      required: true,
      options: []
    };
    
    setTemplate(prev => ({
      ...prev,
      [`${activePhase}Fields`]: [...prev[`${activePhase}Fields`], newField]
    }));
  };

  const updateField = (index, updates) => {
    const fields = [...template[`${activePhase}Fields`]];
    fields[index] = { ...fields[index], ...updates };
    setTemplate(prev => ({
      ...prev,
      [`${activePhase}Fields`]: fields
    }));
  };

  const removeField = (index) => {
    const fields = [...template[`${activePhase}Fields`]];
    fields.splice(index, 1);
    setTemplate(prev => ({
      ...prev,
      [`${activePhase}Fields`]: fields
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await recruitmentService.saveTemplate({ ...template, bootcamp: bootcampId });
      alert('Template saved successfully!');
      if (onSave) onSave();
    } catch (error) {
      alert('Error saving template: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setSaving(true);
      if (template.isPublished) {
        await recruitmentService.unpublishTemplate(bootcampId);
        setTemplate(prev => ({ ...prev, isPublished: false }));
        alert('Template unpublished successfully!');
      } else {
        await recruitmentService.publishTemplate(bootcampId);
        setTemplate(prev => ({ ...prev, isPublished: true }));
        alert('Template published successfully!');
      }
    } catch (error) {
      alert('Error changing publish state: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-portal-text p-10 text-center">Initialising dynamic engine...</div>;

  return (
    <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-portal-border flex items-center justify-between bg-white/5">
        <div>
          <h3 className="text-xl font-bold text-portal-text">Application Designer</h3>
          <p className="text-xs text-portal-text-muted mt-1">Design the journey for your candidates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-portal-bg border border-portal-border text-portal-text rounded-xl font-bold text-sm hover:border-portal-accent/50 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Processing...' : 'Save Draft'}
          </button>
          <button 
            onClick={handleTogglePublish}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 ${
              template.isPublished 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-portal-accent text-portal-bg'
            }`}
          >
            <Eye className="w-4 h-4" />
            {template.isPublished ? 'Unpublish' : 'Publish Template'}
          </button>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="flex border-b border-portal-border bg-portal-bg/50">
        {['phase1', 'phase2', 'waitlist'].map(phase => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
              activePhase === phase 
                ? 'border-portal-accent text-portal-accent bg-portal-accent/5' 
                : 'border-transparent text-portal-text-muted hover:text-portal-text'
            }`}
          >
            {phase.replace('1', ' - Initial').replace('2', ' - Technical').replace('waitlist', 'Waitlist Stage')}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="p-8 min-h-[400px]">
        <div className="space-y-4">
          {template[`${activePhase}Fields`].map((field, index) => (
            <div key={index} className="group relative bg-portal-input border border-portal-border rounded-2xl p-6 hover:border-portal-accent/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="mt-2 text-portal-text-muted cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Question Label</label>
                    <input 
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      className="w-full bg-portal-bg border border-portal-border rounded-xl px-4 py-2 text-sm text-portal-text outline-none focus:border-portal-accent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Input Type</label>
                    <select 
                      value={field.type}
                      onChange={(e) => updateField(index, { type: e.target.value })}
                      className="w-full bg-portal-bg border border-portal-border rounded-xl px-4 py-2 text-sm text-portal-text outline-none focus:border-portal-accent"
                    >
                      {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  {field.type === 'dropdown' && (
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-portal-text-muted uppercase tracking-widest">Options (Comma separated)</label>
                      <input 
                        type="text"
                        placeholder="Option 1, Option 2, Option 3"
                        value={field.options?.join(', ')}
                        onChange={(e) => updateField(index, { options: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full bg-portal-bg border border-portal-border rounded-xl px-4 py-2 text-sm text-portal-text outline-none focus:border-portal-accent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => updateField(index, { required: !field.required })}
                    className={`p-2 rounded-xl border ${field.required ? 'bg-portal-accent/10 border-portal-accent/30 text-portal-accent' : 'bg-white/5 border-portal-border text-portal-text-muted'}`}
                    title="Toggle Required"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeField(index)}
                    className="p-2 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {template[`${activePhase}Fields`].length === 0 && (
            <div className="border-2 border-dashed border-portal-border rounded-3xl p-12 text-center">
              <Settings2 className="w-12 h-12 text-portal-text-muted mx-auto mb-4 opacity-20" />
              <p className="text-portal-text-muted text-sm italic">No questions added for this phase yet.</p>
            </div>
          )}

          <button 
            onClick={addField}
            className="w-full py-4 border-2 border-dashed border-portal-border rounded-2xl flex items-center justify-center gap-2 text-portal-text-muted hover:border-portal-accent hover:text-portal-accent transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-all" />
            <span className="text-xs font-bold uppercase tracking-widest">Add New Field</span>
          </button>
        </div>
      </div>
    </div>
  );
};
