"use client";
import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import publicationsData from '@/app/contents/publicationsContents.json';
import { publicationInterface } from '@/app/contents/interfaces';
const publications = publicationsData as any[];

interface PublicationFilterProps {}

const PublicationFilter: FC<PublicationFilterProps> = ({ }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [revista, setRevista] = useState('');
  const [numero, setNumero] = useState('');
  const [dateFromMonth, setDateFromMonth] = useState('');
  const [dateFromYear, setDateFromYear] = useState('');
  const [dateToMonth, setDateToMonth] = useState('');
  const [dateToYear, setDateToYear] = useState('');

  const toggleFilter = () => {
    setIsFilterOpen(prev => !prev);
  };
  
  // Extract unique values from publications
  const { uniqueMonths, uniqueYears, uniqueRevistas, uniqueNumeros } = useMemo(() => {
    const months = new Set<string>();
    const years = new Set<string>();
    const revistas = new Set<string>();
    const numeros = new Set<string>();

    publications.forEach((pub: publicationInterface) => {
      if (pub.date) {
        const date = new Date(pub.date);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        months.add(month);
        years.add(year);
      }
      if (pub.revista) revistas.add(pub.revista);
      if (pub.número !== undefined) numeros.add(String(pub.número));
    });

    return {
      uniqueMonths: Array.from(months).sort(),
      uniqueYears: Array.from(years).sort().reverse(),
      uniqueRevistas: Array.from(revistas).sort(),
      uniqueNumeros: Array.from(numeros).sort()
    };
  }, []);

  const monthNames: { [key: string]: string } = {
    '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
    '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
    '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
  };

  const buildSearchParams = () => {
    const params: string[] = [];
    
    if (revista) {
      params.push(`revista__${revista}`);
    }
    if (numero) {
      params.push(`número__${numero}`);
    }
    if (dateFromMonth && dateFromYear) {
      params.push(`dateFrom__${dateFromYear}-${dateFromMonth}`);
    }
    if (dateToMonth && dateToYear) {
      params.push(`dateTo__${dateToYear}-${dateToMonth}`);
    }

    return params.join('&');
  };

  const getFilterHref = () => {
    const searchParams = buildSearchParams();
    if (searchParams) {
      return `/logged/pages/publications/search/${encodeURIComponent(searchParams)}`;
    }
    return '#';
  };

  const hasAnyFilter = revista || numero || dateFromMonth || dateFromYear || dateToMonth || dateToYear;
  const canFilter = revista || numero || (dateFromMonth && dateFromYear) || (dateToMonth && dateToYear);

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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
            {/* Revista - Leftmost */}
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

            {/* Número exacto */}
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

            {/* Filtrar por rango de fechas - Desde */}
            <div className='col-span-2'>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Filtrar por rango de fechas - Desde
              </label>
              <div className='grid grid-cols-2 gap-2'>
                <select
                  value={dateFromMonth}
                  onChange={e => setDateFromMonth(e.target.value)}
                  className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>Mes</option>
                  {uniqueMonths.map(month => (
                    <option key={month} value={month}>
                      {monthNames[month] || month}
                    </option>
                  ))}
                </select>
                <select
                  value={dateFromYear}
                  onChange={e => setDateFromYear(e.target.value)}
                  className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>Año</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtrar por rango de fechas - Hasta */}
            <div className='col-span-2'>
              <label className='block text-xs font-medium text-gray-700 mb-2'>
                Filtrar por rango de fechas - Hasta
              </label>
              <div className='grid grid-cols-2 gap-2'>
                <select
                  value={dateToMonth}
                  onChange={e => setDateToMonth(e.target.value)}
                  className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>Mes</option>
                  {uniqueMonths.map(month => (
                    <option key={month} value={month}>
                      {monthNames[month] || month}
                    </option>
                  ))}
                </select>
                <select
                  value={dateToYear}
                  onChange={e => setDateToYear(e.target.value)}
                  className='w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                >
                  <option value=''>Año</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-4'>
            {canFilter ? (
              <Link
                href={getFilterHref()}
                className='px-4 py-2 text-sm cursor-pointer rounded-lg shadow-xl bg-blue-950 text-white hover:bg-blue-950/80 inline-block'
              >
                Filtrar
              </Link>
            ) : (
              <button
                disabled
                className='px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed'
              >
                Filtrar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationFilter;
