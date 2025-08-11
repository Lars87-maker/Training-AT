
import { Route, Routes } from 'react-router-dom'
import AppShell from '../ui/AppShell'
import { lazy, Suspense } from 'react'
const Home = lazy(()=> import('./Home'))
const Phase = lazy(()=> import('./Phase'))
const PhaseDay = lazy(()=> import('./PhaseDay'))
const Test = lazy(()=> import('./Test'))
const Settings = lazy(()=> import('./Settings'))
export default function App(){ return (<AppShell><Suspense fallback={<div className="p-4">Laden…</div>}><Routes>
  <Route path="/" element={<Home/>}/><Route path="/fase/:num" element={<Phase/>}/><Route path="/fase/:num/dag/:dayId" element={<PhaseDay/>}/><Route path="/test" element={<Test/>}/><Route path="/settings" element={<Settings/>}/>
</Routes></Suspense></AppShell>) }
