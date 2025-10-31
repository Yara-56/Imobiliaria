import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';

// --- NOSSOS DADOS FICTÍCIOS ---
const fakeProperties = [
  {
    _id: '1',
    title: 'Casa Espaçosa no Bairro Nobre',
    address: { city: 'Ipatinga', state: 'MG' },
    price: 3500.00,
    imageUrls: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60']
  },
  {
    _id: '2',
    title: 'Apartamento Moderno no Centro',
    address: { city: 'Coronel Fabriciano', state: 'MG' },
    price: 1800.00,
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60']
  },
  {
    _id: '3',
    title: 'Chácara com Piscina',
    address: { city: 'Santana do Paraíso', state: 'MG' },
    price: 2200.00,
    imageUrls: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60']
  }
];

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={property.imageUrls[0]}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h3>
        <p className="text-sm text-gray-500 truncate">{property.address.city}, {property.address.state}</p>
        <p className="text-xl font-bold text-blue-600 mt-2">{formatPrice(property.price)}</p>
        <Link
          to={`/admin/imovel/${property._id}`} // Rota de detalhes atualizada
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <FaHome className="text-blue-600" />
            <span>Imobiliária Lacerda</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Início</Link>
            <Link to="/admin/imoveis" className="text-gray-600 hover:text-blue-600 transition-colors">Ver Imóveis</Link>
            <Link to="/contato" className="text-gray-600 hover:text-blue-600 transition-colors">Contato</Link>
            <Link
              to="/admin/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Acessar
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-xl absolute top-16 left-0 w-full z-40">
            <div className="flex flex-col space-y-2 p-4">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Início</Link>
              <Link to="/admin/imoveis" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Ver Imóveis</Link>
              <Link to="/contato" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Contato</Link>
              <Link
                to="/admin/login"
                className="block w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Acessar
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Encontre seu Próximo Lar
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Os melhores imóveis para alugar ou comprar em Ipatinga e região.
            </p>
            <Link
              to="/admin/imoveis"
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg transform hover:scale-105"
            >
              Ver Imóveis Disponíveis
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Imóveis em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fakeProperties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Imobiliária Lacerda. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Feito para um projeto acadêmico.</p>
        </div>
      </footer>
    </div>
  );
}
