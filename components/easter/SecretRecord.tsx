'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { SECRET_SEQUENCE, SEQUENCE_TIMEOUT, secretMessage } from '@/data/easterEgg';

/**
 * Hidden record, opened by the key sequence in `data/easterEgg.ts`.
 *
 * Nothing here is rendered until the sequence completes, so the message is not
 * in the initial HTML and there is no link, route or asset pointing at it.
 */
export function SecretRecord() {
  const [open, setOpen] = useState(false);
  const progress = useRef(0);
  const lastKeyAt = useRef(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Never swallow keystrokes meant for a form field.
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }

      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      const now = Date.now();
      if (now - lastKeyAt.current > SEQUENCE_TIMEOUT) progress.current = 0;
      lastKeyAt.current = now;

      if (event.code === SECRET_SEQUENCE[progress.current]) {
        progress.current += 1;
        if (progress.current === SECRET_SEQUENCE.length) {
          progress.current = 0;
          setOpen(true);
        }
      } else {
        // A wrong key may still be a valid restart of the sequence.
        progress.current = event.code === SECRET_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink/95 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={secretMessage.title}
        >
          <motion.div
            className="w-full max-w-lg border border-gold/35 bg-graphite/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-gold/20 p-6 lg:p-8">
              <div className="flex items-center gap-4">
                <Logo className="h-9 w-auto" title="AUREON" />
                <div>
                  <p className="data-label-sm text-gold">{secretMessage.eyebrow}</p>
                  <p className="data-label-sm mt-1 text-silver/50">{secretMessage.serial}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="data-label-sm shrink-0 text-silver/60 transition-colors duration-micro ease-aureon hover:text-bone"
                autoFocus
              >
                {secretMessage.close}
              </button>
            </div>

            <div className="p-6 lg:p-8">
              <h2 className="display-heading text-5xl leading-none md:text-6xl">
                {secretMessage.title}
              </h2>

              <div className="mt-6 space-y-4">
                {secretMessage.lines.map((line) => (
                  <p key={line} className="text-pretty text-[1.02rem] leading-relaxed text-bone">
                    {line}
                  </p>
                ))}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-silver/10 pt-6">
                {secretMessage.fields.map((field) => (
                  <div key={field.label}>
                    <dt className="data-label-sm text-silver/45">{field.label}</dt>
                    <dd className="data-label mt-1 text-bone">{field.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex items-end justify-between gap-6 border-t border-gold/20 pt-6">
                <div>
                  <p className="display-heading text-4xl leading-none text-gold">
                    {secretMessage.signature}
                  </p>
                  <p className="data-label-sm mt-2 text-silver/45">
                    {secretMessage.signatureNote}
                  </p>
                </div>
                <p className="data-label-sm max-w-[14rem] text-right text-silver/30">
                  {secretMessage.hint}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SecretRecord;
