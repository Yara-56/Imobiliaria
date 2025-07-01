import React from 'react';
import styles from '../../styles/Inquilinos/ListaInquilinos.module.scss';
import { Link } from 'react-router-dom';

const ListaInquilinos = () => {
  // Simulação de dados
  const inquilinos = [
    {
      id: 1,
      nome: 'João Silva',
      codigoImovel: 'A123',
      dataCadastro: '2023-06-01',
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      codigoImovel: 'B456',
      dataCadastro: '2023-07-10',
    },
  ];

  return (
    <div className={styles.listaContainer}>
      <h1>Inquilinos / Inquilinos Cadastrados</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          className={styles.inputBusca}
        />
        <Link to="/cadastro-inquilino" className={styles.btn}>
          Adicionar Novo Inquilino
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código Imóvel</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {inquilinos.map((inquilino) => (
              <tr key={inquilino.id}>
                <td>{inquilino.nome}</td>
                <td>{inquilino.codigoImovel}</td>
                <td>{inquilino.dataCadastro}</td>
                <td>
                  <Link to={`/perfil-inquilino/${inquilino.id}`} className={styles.btnAcoes}>
                    Visualizar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaInquilinos;
