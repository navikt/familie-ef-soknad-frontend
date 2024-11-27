import React, { Fragment, useState } from 'react';
import { HStack } from '@navikt/ds-react';
import { Check, X } from 'lucide-react';
import {
  feiletRegelSammenligner as feiledeReglerSammenligner,
  parseFeiletRegel,
} from '../utils/RegelUtils';
import { clsx } from 'clsx';

export type Standard = {
  samsvarer: boolean;
  feiletRegel?: string;
};

interface StandardProps {
  standardType: string;
  standard: Standard;
}

export function Standard({ standard, standardType }: StandardProps) {
  const [erÅpen, settErÅpen] = useState(false);
  const feiledeRegler = parseFeiletRegel(standard.feiletRegel);

  return (
    <HStack>
      <div
        className={clsx(
          'p-2 rounded w-full mb-2',
          standard && {
            'bg-green-100': standard.samsvarer,
            'bg-red-100': !standard.samsvarer,
          }
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => settErÅpen(!erÅpen)}
          className={clsx('flex justify-between', {
            'cursor-pointer': !standard.samsvarer,
          })}
        >
          <HStack>
            {standard.samsvarer ? <Check /> : <X />}
            {standardType}
          </HStack>
          <span>{standard.samsvarer ? 'Samsvarer' : 'Samsvarer ikke'}</span>
        </div>
        {erÅpen && !standard.samsvarer && (
          <>
            {feiledeRegler.length > 0 && (
              <ol>
                {feiledeRegler.sort(feiledeReglerSammenligner).map(
                  (regel, indeks) =>
                    regel && (
                      <Fragment key={`${indeks}${regel}`}>
                        <li className="text-gray-700 flex-col flex">
                          <strong>Ikke oppfylt regel:</strong>
                          <span>{regel}</span>
                        </li>
                        {indeks < feiledeRegler.length - 1 && (
                          <hr className="my-2 border-black" />
                        )}
                      </Fragment>
                    )
                )}
              </ol>
            )}
          </>
        )}
      </div>
    </HStack>
  );
}
