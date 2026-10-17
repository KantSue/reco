import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            avisATraiter: number | null;
            [key: string]: unknown;
        };
    }
}
