import '@/css/app.css'; // CSS 파일 임포트
import './globals.css'
import { AuthProvider } from '@/components/provider/AuthProvider';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '중국어 학습',
    description: '쩐시와 함께하는 중국어 수업',
}

export default function RootLayout({ children, }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
