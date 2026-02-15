import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  // Identificador da Organização (Crucial para alugar o sistema)
  // Garante que a sua avó não veja inquilinos de outro cliente seu
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Um inquilino deve pertencer a um proprietário/admin'],
    index: true // Melhora a performance de busca por cliente
  },
  
  name: { 
    type: String, 
    required: [true, 'O nome é obrigatório'],
    trim: true,
    minlength: [3, 'O nome deve ter pelo menos 3 caracteres']
  },
  
  cpf: { 
    type: String, 
    required: [true, 'O CPF é obrigatório'],
    unique: true, 
    trim: true,
    // Validação básica de formato
    match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'Por favor, insira um CPF válido']
  },
  
  email: { 
    type: String,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Por favor, insira um e-mail válido']
  },
  
  phone: { 
    type: String,
    required: [true, 'Telefone de contato é obrigatório']
  },

  status: {
    type: String,
    enum: ['ATIVO', 'INATIVO', 'PENDENTE'],
    default: 'ATIVO'
  },

  // Vinculação com o imóvel atual
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },

  currentContract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },

  // Histórico de observações (muito útil para imobiliárias)
  notes: [{
    content: String,
    date: { type: Date, default: Date.now }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índice Composto: Garante que o mesmo CPF não se repita dentro da mesma organização
tenantSchema.index({ cpf: 1, owner: 1 }, { unique: true });

export default mongoose.model('Tenant', tenantSchema);