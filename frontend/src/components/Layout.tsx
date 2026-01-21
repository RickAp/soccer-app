import { Link } from 'react-router-dom'
import { Trophy, Sun, Moon, Globe } from 'lucide-react'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isDark, setIsDark] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <div className="min-h-screen field-pattern">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold gradient-text">{t('appName')}</h1>
                <p className="text-xs text-muted-foreground">{t('appSubtitle')}</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-2 rounded-full"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{language.toUpperCase()}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>{t('dataBy')}</p>
        </div>
      </footer>
    </div>
  )
}
