'use client';

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@heroui/tooltip';

type TopLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  count: number;
};

export default function MapView({ points }: { points: TopLocation[] }) {
  const router = useRouter();
  const [minCount, maxCount] = useMemo(() => {
    if (points.length === 0) return [0, 0];
    const values = points.map((p) => p.count);
    return [Math.min(...values), Math.max(...values)];
  }, [points]);

  const radiusFor = (c: number) => {
    const rMin = 2.5;
    const rMax = 8;
    if (maxCount === minCount) return (rMin + rMax) / 2;
    const denom = Math.max(1, maxCount - minCount);
    const norm = Math.log1p(Math.max(0, c - minCount)) / Math.log1p(denom);
    const t = Math.max(0, Math.min(1, norm));
    return rMin + t * (rMax - rMin);
  };

  const getName = (g: unknown): string | undefined => {
    if (typeof g !== 'object' || g === null) return undefined;
    const props = (g as Record<string, unknown>).properties;
    if (typeof props !== 'object' || props === null) return undefined;
    const p = props as Record<string, unknown>;
    const keys = [
      'name',
      'NAME',
      'name_long',
      'NAME_LONG',
      'admin',
      'ADMIN',
      'formal_en',
      'FORMAL_EN',
    ];
    for (const k of keys) {
      const v = p[k];
      if (typeof v === 'string' && v.toLowerCase().includes('lesotho'))
        return v;
    }
    return undefined;
  };

  const getKey = (g: unknown): string | undefined => {
    if (typeof g !== 'object' || g === null) return undefined;
    const key = (g as Record<string, unknown>).rsmKey;
    return typeof key === 'string' ? key : undefined;
  };

  const isLesotho = (g: unknown) =>
    (getName(g) ?? '').toLowerCase() === 'lesotho';
  const isSouthAfrica = (g: unknown) =>
    (getName(g) ?? '').toLowerCase() === 'south africa';

  return (
    <div className='mx-auto h-[80vh] w-full max-w-6xl'>
      <ComposableMap
        projection='geoMercator'
        projectionConfig={{ scale: 1500 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[28.2336, -29.61]} zoom={8}>
          <Geographies geography='https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json'>
            {(ctx: { geographies: unknown[] }) => (
              <>
                {ctx.geographies
                  .filter((geo) => isSouthAfrica(geo))
                  .map((geo, idx) => (
                    <Geography
                      key={getKey(geo) ?? `sa-${idx}`}
                      geography={geo}
                      style={{
                        default: {
                          fill: 'hsl(210 20% 97%)',
                          stroke: 'none',
                          outline: 'none',
                        },
                      }}
                    />
                  ))}
                {ctx.geographies
                  .filter((geo) => isLesotho(geo))
                  .map((geo, idx) => (
                    <Geography
                      key={getKey(geo) ?? `ls-${idx}`}
                      geography={geo}
                      style={{
                        default: {
                          fill: 'hsl(210 60% 90%)',
                          stroke: 'none',
                          outline: 'none',
                        },
                        hover: {
                          fill: 'hsl(210 60% 88%)',
                          stroke: 'none',
                          outline: 'none',
                        },
                        pressed: {
                          fill: 'hsl(210 60% 85%)',
                          stroke: 'none',
                          outline: 'none',
                        },
                      }}
                    />
                  ))}
              </>
            )}
          </Geographies>

          {points.map((p) => (
            <Tooltip
              key={p.id}
              content={
                <div className='px-1 py-2'>
                  <div className='text-small font-bold'>{p.name}</div>
                  <div className='text-tiny'>{p.count} photos</div>
                </div>
              }
            >
              <Marker
                coordinates={[p.longitude, p.latitude]}
                onClick={() => router.push(`/locations/${p.id}`)}
                onKeyDown={(e: React.KeyboardEvent<SVGGElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/locations/${p.id}`);
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label={`${p.name} • ${p.count}`}
                className='cursor-pointer focus:outline-none'
              >
                <circle
                  r={radiusFor(p.count)}
                  fill='hsl(220 90% 56%)'
                  fillOpacity={0.5}
                  stroke='white'
                  strokeOpacity={0.55}
                  strokeWidth={0.6}
                  className='hover:fill-opacity-70 transition-all duration-200 focus:stroke-blue-400 focus:stroke-2'
                  style={{
                    outline: 'none',
                  }}
                />
              </Marker>
            </Tooltip>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
