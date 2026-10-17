import { motion } from 'framer-motion'
import { Github, Loader2 } from 'lucide-react'
import { useGithubRepos } from '../../../hooks/useGithubRepos'
import { getSocialLinks } from '../../../config/configLoader'

export const ProjectsSection = () => {
  const social = getSocialLinks()
  const username = social?.github?.username || 'Utsav-CODE-BOT'
  const { repos, loading, error } = useGithubRepos(username, 6)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span className="text-sm">Loading projects from GitHub...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 gap-2">
        <p className="text-red-400 font-medium">Unable to load live projects at this moment.</p>
        <a
          href={social?.github?.url || `https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-400 hover:text-purple-300 underline mt-2"
        >
          View all repositories directly on GitHub &rarr;
        </a>
      </div>
    )
  }

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 px-4 md:px-6"
    >
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative min-h-[200px] flex w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-lg transform group-hover:scale-105 transition-transform" />
          <div className="relative p-4 md:p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm w-full flex flex-col">
            <h3 className="text-xl font-bold mb-2 truncate">{repo.name}</h3>
            <p className="text-gray-400 mb-4 flex-grow line-clamp-3 sm:line-clamp-2">
              {repo.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View Project</span>
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}