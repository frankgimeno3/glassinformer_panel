"use client";
import React, { FC, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import publicacionesData from '@/app/contents/publicaciones.json';
const publicaciones = publicacionesData as any[];

interface PublicationFilterProps {}

const PublicationFilter: FC<PublicationFilterProps> = ({ }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [publicationMonth, setPublicationMonth] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [revista, setRevista] = useState('');
  const [edicion, setEdicion] = useState('');
  const [numero, setNumero] = useState('');
  const router = useRouter();

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };
  
  // Extract unique values from publications
  const { uniqueMonths, uniqueYears, uniqueRevistas, uniqueEdiciones, uniqueNumeros } = useMemo(() => {
    const months = new Set<string>();
    const years = new Set<string>();
    const revistas = new Set<string>();
    const ediciones = new Set<string>();
    const numeros = new Set<string>();

    publicaciones.forEach((pub: any) => {
      if (pub.publication_date) {
        const date = new Date(pub.publication_date);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        months.add(month);
        years.add(year);
      }
      if (pub.revista) revistas.add(pub.revista);
      if (pub.edición) ediciones.add(pub.edición);
      if (pub.número !== undefined) numeros.add(String(pub.número));
    });

    return {
      uniqueMonths: Array.from(months).sort(),
      uniqueYears: Array.from(years).sort().reverse(),
      uniqueRevistas: Array.from(revistas).sort(),
      uniqueEdiciones: Array.from(ediciones).sort(),
      uniqueNumeros: Array.from(numeros).sort((a, b) => Number(a) - Number(b))
    };
  }, []);

  const monthNames: { [key: string]: string } = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
    '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
    '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
  };

  const buildSearchParams = () => {
    const params: string[] = [];
    
    if (publicationMonth && publicationYear) {
      params.push(`publication_date__${publicationYear}-${publicationMonth}`);
    }
    if (revista) {
      params.push(`revista__${revista}`);
    }
    if (edicion) {
      params.push(`edición__${edicion}`);
    }
    if (numero) {
      params.push(`número__${numero}`);
    }

    return params.join('&');
  };

  const handleFilter = () => {
    const searchParams = buildSearchParams();
    if (searchParams) {
      router.push(
        `/logged/pages/publications/search/${encodeURIComponent(searchParams)}`
      );
    }
  };

  const hasAnyFilter = publicationMonth || publicationYear || revista || edicion || numero;
  const canFilter = (publicationMonth && publicationYear) || revista || edicion || numero;

  return (
    <div className='px-36 mx-7'>
      <div
        className='flex flex-col border border-gray-100 shadow-xl text-center py-2 text-xs cursor-pointer hover:bg-gray-100/80'
        onClick={toggleFilter}
      >
        <p>{isFilterOpen ? 'Click to close filter' : 'Click to open filter'}</p>
      </div>
      {isFilterOpen && (
        <div className='bg-white mb-12 shadow-xl border border-gray-100 p-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            {/* Publication Date - Month */}
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Mes
              </label>
              <select
                value={publicationMonth}
                onChange={e => setPublicationMonth(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Seleccionar mes</option>
                {uniqueMonths.map(month => (
                  <option key={month} value={month}>
                    {monthNames[month] || month}
                  </option>
                ))}
              </select>
            </div>

            {/* Publication Date - Year */}
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Año
              </label>
              <select
                value={publicationYear}
                onChange={e => setPublicationYear(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Seleccionar año</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Revista */}
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Revista
              </label>
              <select
                value={revista}
                onChange={e => setRevista(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Seleccionar revista</option>
                {uniqueRevistas.map(rev => (
                  <option key={rev} value={rev}>
                    {rev}
                  </option>
                ))}
              </select>
            </div>

            {/* Edición */}
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Edición
              </label>
              <select
                value={edicion}
                onChange={e => setEdicion(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Seleccionar edición</option>
                {uniqueEdiciones.map(ed => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>

            {/* Número */}
            <div>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Número
              </label>
              <select
                value={numero}
                onChange={e => setNumero(e.target.value)}
                className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              >
                <option value=''>Seleccionar número</option>
                {uniqueNumeros.map(num => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex justify-end mt-4'>
            <button
              onClick={handleFilter}
              disabled={!canFilter}
              className={
                canFilter
                  ? 'px-4 py-2 text-sm cursor-pointer rounded-lg shadow-xl bg-blue-950 text-white hover:bg-blue-950/80'
                  : 'px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            >
              Filtrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationFilter;
